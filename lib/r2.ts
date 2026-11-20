import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Initialize R2 client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const PUBLIC_URL = process.env.R2_PUBLIC_URL || '';

export function getPublicUrl(path: string): string {
    return `${PUBLIC_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export interface R2File {
    filename: string;
    url: string;
    uploadedAt: string;
    size: number;
    pathname: string;
}

// Upload a file to R2
export async function uploadToR2(path: string, file: Buffer | ReadableStream | Blob, contentType?: string): Promise<{ url: string; pathname: string }> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
        Body: file as Buffer,
        ContentType: contentType,
    });

    await r2Client.send(command);

    return {
        url: getPublicUrl(path),
        pathname: path,
    };
}

/** Presigned PUT so browsers can upload directly to R2 (avoids Vercel ~4.5MB body limit). */
export async function getPresignedUploadUrl(
    path: string,
    contentType: string,
    expiresInSeconds = 600
): Promise<{ uploadUrl: string; url: string; pathname: string }> {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
        ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });

    return {
        uploadUrl,
        url: getPublicUrl(path),
        pathname: path,
    };
}

// List files from R2
export async function listFromR2(prefix?: string): Promise<R2File[]> {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
        Prefix: prefix,
    });

    const response = await r2Client.send(command);

    if (!response.Contents) {
        return [];
    }

    return response.Contents.map((item) => {
        const filename = item.Key?.split('/').pop() || '';
        return {
            filename,
            url: getPublicUrl(item.Key || ''),
            uploadedAt: item.LastModified?.toISOString() || new Date().toISOString(),
            size: item.Size || 0,
            pathname: item.Key || '',
        };
    }).filter((file) => file.pathname && !file.pathname.endsWith('/'));
}

// Delete a file from R2
export async function deleteFromR2(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: path,
    });

    await r2Client.send(command);
}

// Check if a file exists in R2
export async function fileExistsInR2(path: string): Promise<boolean> {
    try {
        const command = new HeadObjectCommand({
            Bucket: BUCKET_NAME,
            Key: path,
        });

        await r2Client.send(command);
        return true;
    } catch (error) {
        return false;
    }
}

// Get total storage usage
export async function getR2Usage(): Promise<{ totalSize: number; filesCount: number }> {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET_NAME,
    });

    const response = await r2Client.send(command);

    if (!response.Contents) {
        return { totalSize: 0, filesCount: 0 };
    }

    const totalSize = response.Contents.reduce((sum, item) => sum + (item.Size || 0), 0);

    return {
        totalSize,
        filesCount: response.Contents.length,
    };
}

