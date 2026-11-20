import { fileExistsInR2, getPresignedUploadUrl } from '@/lib/r2';
import { isAuthenticated } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');
        const folder = searchParams.get('folder') || 'documents';
        const allowOverwrite = searchParams.get('overwrite') === 'true';
        const contentType = searchParams.get('contentType') || 'application/octet-stream';

        if (!filename) {
            return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
        }

        const filePath = `${folder}/${filename}`;

        if (!allowOverwrite) {
            const exists = await fileExistsInR2(filePath);
            if (exists) {
                return NextResponse.json(
                    {
                        error: `File "${filename}" already exists. Please delete the old file first or use a different name.`,
                    },
                    { status: 409 }
                );
            }
        }

        const result = await getPresignedUploadUrl(filePath, contentType);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error creating presigned upload URL:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to prepare upload', details: errorMessage },
            { status: 500 }
        );
    }
}
