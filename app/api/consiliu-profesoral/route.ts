import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { blobs } = await list({
            prefix: 'consiliu-profesoral/',
        });

        const profesori = await Promise.all(
            blobs.map(async (blob) => {
                try {
                    const response = await fetch(blob.url);
                    const parsedData = await response.json();
                    return parsedData.profesor;
                } catch (error) {
                    console.error(`Error parsing consiliu-profesoral file ${blob.pathname}:`, error);
                    return null;
                }
            })
        );

        const validProfesori = profesori.filter(p => p !== null);

        // Sort by order then by name
        validProfesori.sort((a: any, b: any) => {
            const aOrder = a.order ?? 999;
            const bOrder = b.order ?? 999;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.nume.localeCompare(b.nume);
        });

        return NextResponse.json({ profesori: validProfesori });
    } catch (error) {
        console.error("Error reading consiliu-profesoral from blob storage:", error);
        return NextResponse.json({ profesori: [], error: "Failed to read consiliu-profesoral" }, { status: 500 });
    }
}

