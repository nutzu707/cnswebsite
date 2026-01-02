import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const fileName = `${id}.json`;

        console.log('Looking for news article:', fileName);

        // Get from blob storage
        const { blobs } = await list({
            prefix: `news/${fileName}`,
        });

        console.log('Found blobs:', blobs.length);

        if (blobs.length === 0) {
            console.log('News article not found in blob storage');
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        // Fetch the JSON content from the blob URL
        console.log('Fetching from blob URL:', blobs[0].url);
        const response = await fetch(blobs[0].url);
        const jsonData = await response.json();
        
        console.log('Successfully fetched news article');
        return NextResponse.json(jsonData);
    } catch (error) {
        console.error('Error fetching news article:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news article', details: String(error) },
            { status: 500 }
        );
    }
}

