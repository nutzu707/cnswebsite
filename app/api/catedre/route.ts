import { listFromR2 } from '@/lib/r2';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const files = await listFromR2('catedre-photos/');

        // Map specific filenames to their labels and order
        const catedreOrder = [
            { filename: 'informatica.jpg', label: 'INFORMATICĂ' },
            { filename: 'matematica.jpg', label: 'MATEMATICĂ' },
            { filename: 'limba-romana.jpg', label: 'LIMBA ROMANĂ' },
            { filename: 'stiinte.jpg', label: 'ȘTIINȚE' },
            { filename: 'limbi-moderne.jpg', label: 'LIMBI MODERNE' },
            { filename: 'istorie-socio-arte-sport.jpg', label: 'ISTORIE SOCIO ARTE SPORT' },
            { filename: 'personal-auxiliar.jpg', label: 'PERSONAL AUXILIAR' },
        ];

        // Create ordered photos array
        const photos = catedreOrder.map(catedra => {
            const file = files.find(f => f.filename === catedra.filename);
            return file ? { ...file, label: catedra.label } : null;
        }).filter(p => p !== null);

        return NextResponse.json({ photos });
    } catch (error) {
        console.error("Error reading catedre photos from R2 storage:", error);
        return NextResponse.json({ photos: [], error: "Failed to read catedre photos" }, { status: 500 });
    }
}
