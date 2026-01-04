import { getR2Usage } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get R2 usage
        const { totalSize, filesCount } = await getR2Usage();

        // Storage limits for R2 (10 GB free tier)
        const storageLimit = 10 * 1024 * 1024 * 1024; // 10 GB in bytes
        const availableSize = Math.max(0, storageLimit - totalSize);

        // Convert to different units
        const totalGB = totalSize / (1024 * 1024 * 1024);
        const limitGB = storageLimit / (1024 * 1024 * 1024);

        return NextResponse.json({
            totalSize: storageLimit,
            usedSize: totalSize,
            availableSize: availableSize,
            totalBytes: totalSize,
            totalMB: totalSize / (1024 * 1024),
            totalGB,
            storageLimit: limitGB,
            percentageUsed: (totalSize / storageLimit) * 100,
            filesCount,
        });
    } catch (error) {
        console.error('Error fetching R2 usage:', error);
        return NextResponse.json(
            { error: 'Failed to fetch storage usage' },
            { status: 500 }
        );
    }
}

