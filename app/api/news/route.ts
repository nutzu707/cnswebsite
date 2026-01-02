import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get news from blob storage only
        const { blobs } = await list({
            prefix: 'news/',
        });

        const newsItems = await Promise.all(
            blobs.map(async (blob) => {
                try {
                    const response = await fetch(blob.url);
                    const jsonData = await response.json();
                    const { title, post_date, thumbnail } = jsonData.article;
                    const fileName = blob.pathname.split('/').pop() || '';

                    return {
                        title,
                        date: post_date,
                        image: thumbnail,
                        link: `/anunt?id=${fileName.replace(".json", "")}`,
                        url: blob.url,
                    };
                } catch (error) {
                    console.error(`Error parsing news file ${blob.pathname}:`, error);
                    return null;
                }
            })
        );

        const validNewsItems = newsItems.filter(item => item !== null);

        return NextResponse.json({ newsItems: validNewsItems });
    } catch (error) {
        console.error("Error reading news from blob storage:", error);
        return NextResponse.json({ newsItems: [], error: "Failed to read news" }, { status: 500 });
    }
}

