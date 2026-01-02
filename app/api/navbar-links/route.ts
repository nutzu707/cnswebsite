import { NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET() {
    try {
        const { blobs } = await list({
            prefix: 'navbar-links/',
        });

        console.log('All navbar-links blobs:', blobs.map(b => b.pathname));

        // Find the most recent config file (it may have a random suffix)
        const configBlobs = blobs
            .filter(blob => blob.pathname.includes('navbar-config'))
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        
        if (configBlobs.length > 0) {
            const configBlob = configBlobs[0]; // Get the most recent one
            console.log('Using config blob:', configBlob.pathname);
            const response = await fetch(configBlob.url);
            const config = await response.json();
            console.log('Config loaded:', config);
            return NextResponse.json(config);
        }

        console.log('No config found, returning empty');
        // Return default config if not found
        return NextResponse.json({
            orar: '',
            premii: ''
        });
    } catch (error) {
        console.error('Error fetching navbar links:', error);
        return NextResponse.json(
            { orar: '', premii: '' },
            { status: 200 }
        );
    }
}

