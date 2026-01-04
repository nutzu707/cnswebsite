import { listFromR2 } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const folder = searchParams.get('folder');

        if (!folder) {
            return NextResponse.json({ error: 'Folder is required' }, { status: 400 });
        }

        // List all files with the given prefix (folder)
        const files = await listFromR2(folder + '/');

        return NextResponse.json({ files });
    } catch (error) {
        console.error('Error listing R2 files:', error);
        return NextResponse.json(
            { files: [], error: 'Failed to list files' },
            { status: 500 }
        );
    }
}

