import { deleteFromR2 } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');
        const pathname = searchParams.get('pathname');

        console.log('Delete request received:', { url, pathname });

        let path: string;

        if (pathname) {
            // If pathname is directly provided, use it
            path = pathname;
            console.log('Using pathname:', path);
        } else if (url) {
            // Otherwise, extract path from URL
            // URL format: https://pub-xxxxx.r2.dev/folder/filename.ext
            const urlObj = new URL(url);
            path = urlObj.pathname.substring(1); // Remove leading slash
            console.log('Extracted path from URL:', path);
        } else {
            console.error('No URL or pathname provided');
            return NextResponse.json({ error: 'URL or pathname is required' }, { status: 400 });
        }

        console.log('Attempting to delete from R2:', path);
        await deleteFromR2(path);
        console.log('Successfully deleted from R2:', path);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting R2 file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to delete file', details: errorMessage },
            { status: 500 }
        );
    }
}

