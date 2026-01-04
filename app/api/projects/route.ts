import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Get projects from R2 storage
        const files = await listFromR2('projects/');

        // Filter only JSON files (not images from projects/photos)
        const projectJsonFiles = files.filter(file => 
            file.filename.endsWith('.json') && 
            file.pathname.startsWith('projects/') && 
            !file.pathname.includes('projects/photos/')
        );

        const projects = await Promise.all(
            projectJsonFiles.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    const jsonData = await response.json();
                    
                    return {
                        ...jsonData.project,
                        url: file.url, // Include URL for deletion
                    };
                } catch (error) {
                    console.error(`Error parsing project file ${file.pathname}:`, error);
                    return null;
                }
            })
        );

        const validProjects = projects.filter(item => item !== null);

        return NextResponse.json({ projects: validProjects });
    } catch (error) {
        console.error("Error reading projects from R2 storage:", error);
        return NextResponse.json({ projects: [], error: "Failed to read projects" }, { status: 500 });
    }
}

