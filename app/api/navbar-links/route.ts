import { NextResponse } from 'next/server';
import { listFromR2 } from '@/lib/r2';

export async function GET() {
    try {
        const files = await listFromR2('navbar-links/');

        console.log('All navbar-links files:', files.map(f => f.pathname));

        // Find the most recent config file (it may have a random suffix)
        const configFiles = files
            .filter(file => file.pathname.includes('navbar-config'))
            .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        
        if (configFiles.length > 0) {
            const configFile = configFiles[0]; // Get the most recent one
            console.log('Using config file:', configFile.pathname);
            const response = await fetch(configFile.url);
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

