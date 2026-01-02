import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const folder = searchParams.get('folder') || 'documents';

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        if (!request.body) {
            return NextResponse.json({ error: 'Request body is required' }, { status: 400 });
        }

        // Create a path with folder structure
        const blobPath = `${folder}/${filename}`;

        console.log('Uploading to blob:', blobPath);

        const blob = await put(blobPath, request.body, {
            access: 'public',
            addRandomSuffix: true, // Automatically append unique suffix to avoid conflicts
        });

        console.log('Upload successful:', blob.url);

        return NextResponse.json(blob);
    } catch (error) {
        console.error('Error uploading to blob:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to upload file', details: errorMessage },
            { status: 500 }
        );
    }
}

