import { deleteFromR2 } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Extract the path from the URL
        // URL format: https://pub-xxxxx.r2.dev/folder/filename.ext
        const urlObj = new URL(url);
        const path = urlObj.pathname.substring(1); // Remove leading slash

        await deleteFromR2(path);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting R2 file:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}

