import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // List all blobs in the store
        const { blobs } = await list();

        // Calculate total size in bytes
        const totalBytes = blobs.reduce((sum, blob) => sum + blob.size, 0);

        // Convert to GB
        const totalGB = totalBytes / (1024 * 1024 * 1024);

        // Storage limits based on plan (can be adjusted)
        const storageLimit = 0.9; // 900 MB = 0.9 GB
        // Adjust this based on your Vercel plan limits

        return NextResponse.json({
            totalBytes,
            totalMB: totalBytes / (1024 * 1024),
            totalGB,
            storageLimit,
            percentageUsed: (totalGB / storageLimit) * 100,
            filesCount: blobs.length,
        });
    } catch (error) {
        console.error('Error fetching blob usage:', error);
        return NextResponse.json(
            { error: 'Failed to fetch storage usage' },
            { status: 500 }
        );
    }
}

