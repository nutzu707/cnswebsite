import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const url = searchParams.get('url');

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        await del(url);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting blob:', error);
        return NextResponse.json(
            { error: 'Failed to delete file' },
            { status: 500 }
        );
    }
}

