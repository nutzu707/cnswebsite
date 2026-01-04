import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    const body = (await request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname) => {
                // Security: validate file type, size, etc. here if needed
                console.log('Generating token for:', pathname);
                return {
                    allowedContentTypes: [
                        'image/jpeg',
                        'image/png',
                        'image/jpg',
                        'image/webp',
                        'application/pdf',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/json',
                    ],
                    maximumSizeInBytes: 50 * 1024 * 1024, // 50 MB max
                };
            },
            onUploadCompleted: async ({ blob }) => {
                console.log('Upload completed:', blob.url);
            },
        });

        return NextResponse.json(jsonResponse);
    } catch (error: any) {
        console.error('Error generating upload token:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate upload token' },
            { status: 400 }
        );
    }
}

