import { uploadToR2, fileExistsInR2 } from '@/lib/r2';
import { isAuthenticated } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Server-side upload proxy. Prefer /api/blob/presign + direct R2 PUT for large files
 * (Vercel rejects bodies over ~4.5MB with "Request Entity Too Large").
 */
export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const folder = searchParams.get('folder') || 'documents';
        const allowOverwrite = searchParams.get('overwrite') === 'true';

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        if (!request.body) {
            return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
        }

        const filePath = `${folder}/${filename}`;

        if (!allowOverwrite) {
            const exists = await fileExistsInR2(filePath);
            if (exists) {
                return NextResponse.json(
                    { error: `File "${filename}" already exists. Please delete the old file first or use a different name.` },
                    { status: 409 }
                );
            }
        }

        const contentType = request.headers.get('content-type') || 'application/octet-stream';
        const arrayBuffer = await request.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Soft guard: Vercel will often reject larger bodies before this runs
        if (buffer.byteLength > 4 * 1024 * 1024) {
            return NextResponse.json(
                {
                    error: 'File too large for proxy upload. Use the dashboard upload flow (direct R2) for files over 4MB.',
                },
                { status: 413 }
            );
        }

        const result = await uploadToR2(filePath, buffer, contentType);

        return NextResponse.json({
            url: result.url,
            pathname: result.pathname,
        });
    } catch (error: any) {
        console.error('Error uploading to R2:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to upload file', details: errorMessage },
            { status: 500 }
        );
    }
}
