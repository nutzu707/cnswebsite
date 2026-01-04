import { uploadToR2, fileExistsInR2 } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
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

        // Create a path with folder structure
        const filePath = `${folder}/${filename}`;

        // Check if file already exists (unless overwrite is allowed)
        if (!allowOverwrite) {
            const exists = await fileExistsInR2(filePath);
            if (exists) {
                return NextResponse.json(
                    { error: `File "${filename}" already exists. Please delete the old file first or use a different name.` },
                    { status: 409 }
                );
            }
        }

        console.log('Uploading to R2:', filePath);

        // Get content type from request headers
        const contentType = request.headers.get('content-type') || 'application/octet-stream';

        // Convert ReadableStream to Buffer
        const arrayBuffer = await request.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to R2
        const result = await uploadToR2(filePath, buffer, contentType);

        console.log('Upload successful:', result.url);

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

