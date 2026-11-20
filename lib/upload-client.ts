/**
 * Client-side helpers for uploading to R2.
 * - Small files: single POST through /api/blob/upload
 * - Large files: multipart chunks through /api/blob/multipart (avoids Vercel 4.5MB limit + R2 CORS)
 */

const PROXY_UPLOAD_MAX_BYTES = 3.5 * 1024 * 1024;
const MULTIPART_CHUNK_BYTES = 3 * 1024 * 1024; // under Vercel body limit

export async function parseJsonResponse<T = any>(response: Response): Promise<T> {
    const text = await response.text();
    try {
        return (text ? JSON.parse(text) : {}) as T;
    } catch {
        const snippet = text.replace(/\s+/g, ' ').trim().slice(0, 180);
        throw new Error(
            snippet
                ? `Server returned a non-JSON response: ${snippet}`
                : `Request failed with status ${response.status}`
        );
    }
}

export interface UploadResult {
    url: string;
    pathname: string;
}

async function uploadViaProxy(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    const contentType =
        options?.contentType ||
        (file instanceof File && file.type ? file.type : undefined) ||
        'application/octet-stream';
    const overwrite = options?.overwrite ? 'true' : 'false';

    const params = new URLSearchParams({
        filename,
        folder,
        overwrite,
    });

    const response = await fetch(`/api/blob/upload?${params.toString()}`, {
        method: 'POST',
        body: file,
        headers: {
            'Content-Type': contentType,
        },
    });

    const data = await parseJsonResponse<{
        url?: string;
        pathname?: string;
        error?: string;
        details?: string;
    }>(response);

    if (!response.ok || !data.url || !data.pathname) {
        throw new Error(data.error || data.details || `Upload failed (${response.status})`);
    }

    return { url: data.url, pathname: data.pathname };
}

async function uploadViaMultipart(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    const contentType =
        options?.contentType ||
        (file instanceof File && file.type ? file.type : undefined) ||
        'application/octet-stream';
    const overwrite = options?.overwrite ? 'true' : 'false';

    const initParams = new URLSearchParams({
        action: 'init',
        filename,
        folder,
        overwrite,
        contentType,
    });

    const initResponse = await fetch(`/api/blob/multipart?${initParams.toString()}`, {
        method: 'POST',
    });
    const initData = await parseJsonResponse<{
        uploadId?: string;
        pathname?: string;
        error?: string;
        details?: string;
    }>(initResponse);

    if (!initResponse.ok || !initData.uploadId || !initData.pathname) {
        throw new Error(initData.error || initData.details || `Failed to start upload (${initResponse.status})`);
    }

    const { uploadId, pathname } = initData;
    const parts: { ETag: string; PartNumber: number }[] = [];

    try {
        const totalParts = Math.max(1, Math.ceil(file.size / MULTIPART_CHUNK_BYTES));

        for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const start = (partNumber - 1) * MULTIPART_CHUNK_BYTES;
            const end = Math.min(start + MULTIPART_CHUNK_BYTES, file.size);
            const chunk = file.slice(start, end);

            const partParams = new URLSearchParams({
                action: 'part',
                pathname,
                uploadId,
                partNumber: String(partNumber),
            });

            const partResponse = await fetch(`/api/blob/multipart?${partParams.toString()}`, {
                method: 'POST',
                body: chunk,
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            const partData = await parseJsonResponse<{
                ETag?: string;
                PartNumber?: number;
                error?: string;
                details?: string;
            }>(partResponse);

            if (!partResponse.ok || !partData.ETag || !partData.PartNumber) {
                throw new Error(
                    partData.error ||
                        partData.details ||
                        `Failed to upload part ${partNumber}/${totalParts}`
                );
            }

            parts.push({ ETag: partData.ETag, PartNumber: partData.PartNumber });
        }

        const completeResponse = await fetch('/api/blob/multipart?action=complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pathname, uploadId, parts }),
        });

        const completeData = await parseJsonResponse<{
            url?: string;
            pathname?: string;
            error?: string;
            details?: string;
        }>(completeResponse);

        if (!completeResponse.ok || !completeData.url || !completeData.pathname) {
            throw new Error(
                completeData.error ||
                    completeData.details ||
                    `Failed to finalize upload (${completeResponse.status})`
            );
        }

        return { url: completeData.url, pathname: completeData.pathname };
    } catch (error) {
        // Best-effort cleanup so incomplete multipart uploads don't pile up in R2
        try {
            await fetch('/api/blob/multipart?action=abort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pathname, uploadId }),
            });
        } catch {
            // ignore abort failures
        }
        throw error;
    }
}

export async function uploadToBlob(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    if (file.size > PROXY_UPLOAD_MAX_BYTES) {
        return uploadViaMultipart(file, filename, folder, options);
    }

    try {
        return await uploadViaProxy(file, filename, folder, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        // Platform rejected body as too large — retry with chunked multipart
        if (/entity too large|413|too large|non-JSON response: Request En|Failed to fetch/i.test(message)) {
            return uploadViaMultipart(file, filename, folder, options);
        }
        throw error;
    }
}

/** Extract R2 object key from a public file URL when possible. */
export function pathnameFromPublicUrl(url: string): string | null {
    try {
        const { pathname } = new URL(url);
        const cleaned = pathname.replace(/^\/+/, '');
        return cleaned || null;
    } catch {
        return null;
    }
}
