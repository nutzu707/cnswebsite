import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const files = await listFromR2('diriginti/');

        const diriginti = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    const parsedData = await response.json();
                    return {
                        ...parsedData.diriginte,
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                    };
                } catch (error) {
                    console.error(`Error parsing diriginti file ${file.pathname}:`, error);
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
        console.error("Error reading diriginti from R2 storage:", error);
        return NextResponse.json({ diriginti: [], error: "Failed to read diriginti" }, { status: 500 });
    }
}

