import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const files = await listFromR2('consiliu-profesoral/');

        const profesori = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await fetch(file.url);
                    const parsedData = await response.json();
                    return {
                        ...parsedData.profesor,
                        filename: file.filename,
                        url: file.url,
                        pathname: file.pathname,
                    };
                } catch (error) {
                    console.error(`Error parsing consiliu-profesoral file ${file.pathname}:`, error);
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
        console.error("Error reading consiliu-profesoral from R2 storage:", error);
        return NextResponse.json({ profesori: [], error: "Failed to read consiliu-profesoral" }, { status: 500 });
    }
}

