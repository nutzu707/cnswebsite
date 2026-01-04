import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get news from R2 storage
        const files = await listFromR2('news/');

        // Filter only JSON files (not images from news/thumbnails or news/images)
        const newsJsonFiles = files.filter(file => 
            file.filename.endsWith('.json') && 
            file.pathname.startsWith('news/') && 
            !file.pathname.includes('news/thumbnails/') &&
            !file.pathname.includes('news/images/')
        );

        const newsItems = await Promise.all(
            newsJsonFiles.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    const jsonData = await response.json();
                    const { title, post_date, thumbnail } = jsonData.article;

                    return {
                        title,
                        date: post_date,
                        image: thumbnail, // Now this is an R2 URL, not base64!
                        link: `/anunt?id=${file.filename.replace(".json", "")}`,
                        url: file.url,
                    };
                } catch (error) {
                    console.error(`Error parsing news file ${file.pathname}:`, error);
                    return null;
                }
            })
        );

        const validNewsItems = newsItems.filter(item => item !== null);

        // Sort by date (newest first)
        validNewsItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ newsItems: validNewsItems });
    } catch (error) {
        console.error("Error reading news from R2 storage:", error);
        return NextResponse.json({ newsItems: [], error: "Failed to read news" }, { status: 500 });
    }
}

