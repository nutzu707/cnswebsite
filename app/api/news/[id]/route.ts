import { listFromR2 } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const fileName = `${id}.json`;

        console.log('Looking for news article:', fileName);

        // Prefer exact key match; list prefix can return unrelated siblings
        const files = (await listFromR2(`news/${fileName}`)).filter(
            (file) => file.pathname === `news/${fileName}` || file.filename === fileName
        );

        console.log('Found files:', files.length);

        if (files.length === 0) {
            console.log('News article not found in R2 storage');
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }

        console.log('Fetching from R2 URL:', files[0].url);
        const response = await fetch(files[0].url);
        if (!response.ok) {
            return NextResponse.json(
                { error: 'News article not found' },
                { status: 404 }
            );
        }
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

