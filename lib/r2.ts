import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    ListObjectsV2Command,
    HeadObjectCommand,
    PutBucketCorsCommand,
    GetBucketCorsCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

const DEFAULT_CORS_ORIGINS = [
    'https://www.cnszalau.ro',
    'https://cnszalau.ro',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

let corsEnsurePromise: Promise<{ ok: boolean; message: string }> | null = null;

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

function getCorsOrigins(): string[] {
    const extra = (process.env.R2_CORS_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    return Array.from(new Set([...DEFAULT_CORS_ORIGINS, ...extra]));
}

/**
 * Ensure the R2 bucket allows browser PUT/GET from the site origins.
 * Required for direct (presigned) uploads that bypass Vercel's body size limit.
 */
export async function ensureR2Cors(): Promise<{ ok: boolean; message: string }> {
    if (!corsEnsurePromise) {
        corsEnsurePromise = (async () => {
            if (!BUCKET_NAME) {
                return { ok: false, message: 'R2_BUCKET_NAME is not configured' };
            }

            const origins = getCorsOrigins();
            const desiredRules = [
                {
                    AllowedOrigins: origins,
                    AllowedMethods: ['GET', 'PUT', 'HEAD'],
                    AllowedHeaders: ['*'],
                    ExposeHeaders: ['ETag', 'Location', 'Content-Length'],
                    MaxAgeSeconds: 86400,
                },
            ];

            try {
                // Skip rewrite if an equivalent rule already exists
                try {
                    const existing = await r2Client.send(
                        new GetBucketCorsCommand({ Bucket: BUCKET_NAME })
                    );
                    const rule = existing.CORSRules?.[0];
                    const hasAllOrigins = origins.every((origin) =>
                        (rule?.AllowedOrigins || []).includes(origin)
                    );
                    const allowsPut = (rule?.AllowedMethods || []).includes('PUT');
                    if (hasAllOrigins && allowsPut) {
                        return { ok: true, message: 'R2 CORS already configured' };
                    }
                } catch {
                    // No CORS config yet — continue to set it
                }

                await r2Client.send(
                    new PutBucketCorsCommand({
                        Bucket: BUCKET_NAME,
                        CORSConfiguration: {
                            CORSRules: desiredRules,
                        },
                    })
                );

                return { ok: true, message: 'R2 CORS configured successfully' };
            } catch (error) {
                // Allow retry later if credentials lack bucket admin permission
                corsEnsurePromise = null;
                const message = error instanceof Error ? error.message : 'Unknown CORS error';
                console.error('Failed to configure R2 CORS:', error);
                return {
                    ok: false,
                    message: `Could not auto-configure R2 CORS: ${message}`,
                };
            }
        })();
    }

    return corsEnsurePromise;
}

export async function uploadToR2(
    path: string,
    file: Buffer | ReadableStream | Blob,
    contentType?: string
): Promise<{ url: string; pathname: string }> {
    await r2Client.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: path,
            Body: file as Buffer,
            ContentType: contentType,
        })
    );

    return {
        url: getPublicUrl(path),
        pathname: path,
    };
}

/** Presigned PUT — browser uploads directly to R2 (any file size). */
export async function getPresignedUploadUrl(
    path: string,
    contentType: string,
    expiresInSeconds = 900
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

export async function listFromR2(prefix?: string): Promise<R2File[]> {
    const files: R2File[] = [];
    let continuationToken: string | undefined;

    do {
        const response = await r2Client.send(
            new ListObjectsV2Command({
                Bucket: BUCKET_NAME,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            })
        );

        for (const item of response.Contents || []) {
            if (!item.Key || item.Key.endsWith('/')) continue;
            files.push({
                filename: item.Key.split('/').pop() || '',
                url: getPublicUrl(item.Key),
                uploadedAt: item.LastModified?.toISOString() || new Date().toISOString(),
                size: item.Size || 0,
                pathname: item.Key,
            });
        }

        continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
    } while (continuationToken);

    return files;
}

export async function deleteFromR2(path: string): Promise<void> {
    await r2Client.send(
        new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: path,
        })
    );
}

export async function fileExistsInR2(path: string): Promise<boolean> {
    try {
        await r2Client.send(
            new HeadObjectCommand({
                Bucket: BUCKET_NAME,
                Key: path,
            })
        );
        return true;
    } catch {
        return false;
    }
}

export async function getR2Usage(): Promise<{ totalSize: number; filesCount: number }> {
    const files = (await listFromR2()).filter((file) => !file.pathname.startsWith('_tmp/'));
    return {
        totalSize: files.reduce((sum, file) => sum + file.size, 0),
        filesCount: files.length,
    };
}
