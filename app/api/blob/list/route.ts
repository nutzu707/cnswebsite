import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');

        if (!folder) {
            return NextResponse.json({ error: 'Folder is required' }, { status: 400 });
        }

        // List all blobs with the given prefix (folder)
        const { blobs } = await list({
            prefix: folder + '/',
        });

        // Extract just the filenames from the full paths
        const files = blobs.map(blob => ({
            filename: blob.pathname.split('/').pop() || blob.pathname,
            url: blob.url,
            uploadedAt: blob.uploadedAt,
            size: blob.size,
            pathname: blob.pathname,
        }));

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Error listing blobs:', error);
        return NextResponse.json(
            { files: [], error: 'Failed to list files' },
            { status: 500 }
        );
    }
}

