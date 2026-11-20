import { NextResponse } from 'next/server';

/**
 * Legacy proxy upload endpoint.
 * Large files cannot go through Vercel (≈4.5MB limit). Use /api/blob/presign instead.
 */
export async function POST(): Promise<NextResponse> {
    return NextResponse.json(
        {
            error:
                'Proxy upload is disabled. Use the dashboard upload flow (direct R2 via presigned URL).',
        },
        { status: 410 }
    );
}
