import {
    deleteFromR2,
    fileExistsInR2,
    listFromR2,
    uploadToR2,
} from '@/lib/r2';
import { isAuthenticated } from '@/lib/auth';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CHUNK_MAX_BYTES = 3.5 * 1024 * 1024;
const MAX_FILE_BYTES = 100 * 1024 * 1024;

const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

async function readObjectBuffer(key: string): Promise<Buffer> {
    const response = await r2Client.send(
        new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        })
    );

    if (!response.Body) {
        throw new Error(`Missing body for temp object ${key}`);
    }

    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
}

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
            const totalSize = Number(searchParams.get('totalSize') || '0');

            if (!filename) {
                return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
            }
            if (!Number.isFinite(totalSize) || totalSize <= 0) {
                return NextResponse.json({ error: 'totalSize is required' }, { status: 400 });
            }
            if (totalSize > MAX_FILE_BYTES) {
                return NextResponse.json(
                    { error: `File too large (max ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))}MB)` },
                    { status: 413 }
                );
            }

            const pathname = `${folder}/${filename}`;
            if (!allowOverwrite && (await fileExistsInR2(pathname))) {
                return NextResponse.json(
                    {
                        error: `File "${filename}" already exists. Please delete the old file first or use a different name.`,
                    },
                    { status: 409 }
                );
            }

            const sessionId = randomBytes(16).toString('hex');
            return NextResponse.json({
                sessionId,
                pathname,
                contentType,
                chunkSize: CHUNK_MAX_BYTES,
            });
        }

        if (action === 'chunk') {
            const sessionId = searchParams.get('sessionId');
            const index = Number(searchParams.get('index'));

            if (!sessionId || !/^[a-f0-9]{32}$/.test(sessionId)) {
                return NextResponse.json({ error: 'Invalid sessionId' }, { status: 400 });
            }
            if (!Number.isInteger(index) || index < 0) {
                return NextResponse.json({ error: 'Invalid chunk index' }, { status: 400 });
            }

            const arrayBuffer = await request.arrayBuffer();
            if (arrayBuffer.byteLength === 0) {
                return NextResponse.json({ error: 'Empty chunk' }, { status: 400 });
            }
            if (arrayBuffer.byteLength > CHUNK_MAX_BYTES) {
                return NextResponse.json({ error: 'Chunk too large' }, { status: 413 });
            }

            const tempPath = `_tmp/${sessionId}/${String(index).padStart(5, '0')}`;
            await uploadToR2(tempPath, Buffer.from(arrayBuffer), 'application/octet-stream');

            return NextResponse.json({ ok: true, index, bytes: arrayBuffer.byteLength });
        }

        if (action === 'complete') {
            const body = await request.json();
            const sessionId = body?.sessionId as string | undefined;
            const pathname = body?.pathname as string | undefined;
            const contentType = (body?.contentType as string | undefined) || 'application/octet-stream';
            const totalChunks = Number(body?.totalChunks);

            if (!sessionId || !pathname || !Number.isInteger(totalChunks) || totalChunks < 1) {
                return NextResponse.json(
                    { error: 'sessionId, pathname, and totalChunks are required' },
                    { status: 400 }
                );
            }

            const prefix = `_tmp/${sessionId}/`;
            const tempFiles = (await listFromR2(prefix)).sort((a, b) =>
                a.filename.localeCompare(b.filename)
            );

            if (tempFiles.length !== totalChunks) {
                return NextResponse.json(
                    {
                        error: `Expected ${totalChunks} chunks, found ${tempFiles.length}. Please retry the upload.`,
                    },
                    { status: 400 }
                );
            }

            const buffers: Buffer[] = [];
            let total = 0;
            for (const file of tempFiles) {
                const buf = await readObjectBuffer(file.pathname);
                total += buf.byteLength;
                if (total > MAX_FILE_BYTES) {
                    throw new Error('Assembled file exceeds size limit');
                }
                buffers.push(buf);
            }

            const assembled = Buffer.concat(buffers);
            const result = await uploadToR2(pathname, assembled, contentType);

            // Cleanup temp chunks (best effort)
            await Promise.all(
                tempFiles.map(async (file) => {
                    try {
                        await deleteFromR2(file.pathname);
                    } catch (error) {
                        console.error('Failed to delete temp chunk', file.pathname, error);
                    }
                })
            );

            return NextResponse.json(result);
        }

        if (action === 'abort') {
            const body = await request.json().catch(() => ({}));
            const sessionId = body?.sessionId as string | undefined;
            if (!sessionId) {
                return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
            }

            const tempFiles = await listFromR2(`_tmp/${sessionId}/`);
            await Promise.all(
                tempFiles.map(async (file) => {
                    try {
                        await deleteFromR2(file.pathname);
                    } catch {
                        // ignore
                    }
                })
            );

            return NextResponse.json({ ok: true });
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    } catch (error) {
        console.error('Chunked upload error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Chunked upload failed', details: errorMessage },
            { status: 500 }
        );
    }
}
