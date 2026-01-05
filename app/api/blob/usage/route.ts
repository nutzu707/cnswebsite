import { getR2Usage } from '@/lib/r2';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get R2 usage
        const { totalSize, filesCount } = await getR2Usage();

        // Storage limits (1 GB = 1024 MB)
        const storageLimit = 1 * 1024 * 1024 * 1024; // 1 GB in bytes
        const availableSize = Math.max(0, storageLimit - totalSize);

        // Convert to different units
        const totalMB = totalSize / (1024 * 1024);
        const limitMB = storageLimit / (1024 * 1024);

        return NextResponse.json({
            totalSize: storageLimit,
            usedSize: totalSize,
            availableSize: availableSize,
            totalBytes: totalSize,
            totalMB,
            storageLimit: limitMB,
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

