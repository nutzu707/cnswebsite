import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { blobs } = await list({
            prefix: 'conducere/',
        });

        const people = await Promise.all(
            blobs.map(async (blob) => {
                try {
                    const response = await fetch(blob.url);
                    const parsedData = await response.json();
                    return {
                        filename: blob.pathname.split('/').pop() || '',
                        person: parsedData.person,
                    };
                } catch (error) {
                    console.error(`Error parsing conducere file ${blob.pathname}:`, error);
                    return null;
                }
            })
        );

        const validPeople = people.filter(p => p !== null);

        return NextResponse.json({ people: validPeople });
    } catch (error) {
        console.error("Error reading conducere from blob storage:", error);
        return NextResponse.json({ people: [], error: "Failed to read conducere" }, { status: 500 });
    }
}
