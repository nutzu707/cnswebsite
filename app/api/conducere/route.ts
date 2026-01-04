import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const files = await listFromR2('conducere/');

        const people = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    const parsedData = await response.json();
                    return {
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                        person: parsedData.person,
                    };
                } catch (error) {
                    console.error(`Error parsing conducere file ${file.pathname}:`, error);
                    return null;
                }
            })
        );

        const validPeople = people.filter(p => p !== null);
        
        // Sort by order if available
        validPeople.sort((a, b) => {
            const aOrder = a.person?.order ?? 999;
            const bOrder = b.person?.order ?? 999;
            return aOrder - bOrder;
        });

        return NextResponse.json({ people: validPeople });
    } catch (error) {
        console.error("Error reading conducere from R2 storage:", error);
        return NextResponse.json({ people: [], error: "Failed to read conducere" }, { status: 500 });
    }
}
