import { list } from '@vercel/blob';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { blobs } = await list({
            prefix: 'diriginti/',
        });

        const diriginti = await Promise.all(
            blobs.map(async (blob) => {
                try {
                    const response = await fetch(blob.url);
                    const parsedData = await response.json();
                    return parsedData.diriginte;
                } catch (error) {
                    console.error(`Error parsing diriginti file ${blob.pathname}:`, error);
                    return null;
                }
            })
        );

        const validDiriginti = diriginti.filter(d => d !== null);

        // Sort by order then by name
        validDiriginti.sort((a: any, b: any) => {
            const aOrder = a.order ?? 999;
            const bOrder = b.order ?? 999;
            if (aOrder !== bOrder) return aOrder - bOrder;
            return a.nume.localeCompare(b.nume);
        });

        return NextResponse.json({ diriginti: validDiriginti });
    } catch (error) {
        console.error("Error reading diriginti from blob storage:", error);
        return NextResponse.json({ diriginti: [], error: "Failed to read diriginti" }, { status: 500 });
    }
}

