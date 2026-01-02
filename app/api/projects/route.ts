import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get projects from blob storage only
        const { blobs } = await list({
            prefix: 'projects/',
        });

        const projects = await Promise.all(
            blobs.map(async (blob) => {
                try {
                    const response = await fetch(blob.url);
                    const jsonData = await response.json();
                    
                    return jsonData;
                } catch (error) {
                    console.error(`Error parsing project file ${blob.pathname}:`, error);
                    return null;
                }
            })
        );

        const validProjects = projects.filter(item => item !== null);

        return NextResponse.json({ projects: validProjects });
    } catch (error) {
        console.error("Error reading projects from blob storage:", error);
        return NextResponse.json({ projects: [], error: "Failed to read projects" }, { status: 500 });
    }
}

