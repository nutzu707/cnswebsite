import {
    abortMultipartUpload,
    completeMultipartUpload,
    createMultipartUpload,
    fileExistsInR2,
    uploadMultipartPart,
} from '@/lib/r2';
import { isAuthenticated } from '@/lib/auth';
import { NextResponse } from 'next/server';

const MAX_PART_BYTES = 4 * 1024 * 1024; // stay under Vercel's ~4.5MB body limit

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');

        if (action === 'init') {
            const filename = searchParams.get('filename');
            const folder = searchParams.get('folder') || 'documents';
            const allowOverwrite = searchParams.get('overwrite') === 'true';
            const contentType = searchParams.get('contentType') || 'application/octet-stream';

            if (!filename) {
                return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
            }

            const pathname = `${folder}/${filename}`;

            if (!allowOverwrite) {
                const exists = await fileExistsInR2(pathname);
                if (exists) {
                    return NextResponse.json(
                        {
                            error: `File "${filename}" already exists. Please delete the old file first or use a different name.`,
                        },
                        { status: 409 }
                    );
                }
            }

            const uploadId = await createMultipartUpload(pathname, contentType);

            return NextResponse.json({ uploadId, pathname });
        }

        if (action === 'part') {
            const pathname = searchParams.get('pathname');
            const uploadId = searchParams.get('uploadId');
            const partNumber = Number(searchParams.get('partNumber'));

            if (!pathname || !uploadId || !Number.isInteger(partNumber) || partNumber < 1) {
                return NextResponse.json(
                    { error: 'pathname, uploadId, and partNumber are required' },
                    { status: 400 }
                );
            }

            const arrayBuffer = await request.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                return NextResponse.json({ error: 'Empty part body' }, { status: 400 });
            }
            if (arrayBuffer.byteLength > MAX_PART_BYTES) {
                return NextResponse.json(
                    { error: `Part too large (max ${MAX_PART_BYTES} bytes)` },
                    { status: 413 }
                );
            }

            const part = await uploadMultipartPart(
                pathname,
                uploadId,
                partNumber,
                Buffer.from(arrayBuffer)
            );

            return NextResponse.json(part);
        }

        if (action === 'complete') {
            const body = await request.json();
            const pathname = body?.pathname as string | undefined;
            const uploadId = body?.uploadId as string | undefined;
            const parts = body?.parts as { ETag: string; PartNumber: number }[] | undefined;

            if (!pathname || !uploadId || !Array.isArray(parts) || parts.length === 0) {
                return NextResponse.json(
                    { error: 'pathname, uploadId, and parts are required' },
                    { status: 400 }
                );
            }

            const result = await completeMultipartUpload(pathname, uploadId, parts);
            return NextResponse.json(result);
        }

        if (action === 'abort') {
            const body = await request.json().catch(() => ({}));
            const pathname = (body?.pathname || searchParams.get('pathname')) as string | undefined;
            const uploadId = (body?.uploadId || searchParams.get('uploadId')) as string | undefined;

            if (!pathname || !uploadId) {
                return NextResponse.json(
                    { error: 'pathname and uploadId are required' },
                    { status: 400 }
                );
            }

            await abortMultipartUpload(pathname, uploadId);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (error) {
        console.error('Multipart upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Multipart upload failed', details: errorMessage },
            { status: 500 }
        );
    }
}
