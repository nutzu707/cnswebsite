/**
 * Client-side helpers for uploading to R2.
 * Small files go through the API proxy; larger files use presigned URLs
 * so they are not blocked by Vercel's ~4.5MB request body limit.
 */

const PROXY_UPLOAD_MAX_BYTES = 3.5 * 1024 * 1024;

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

async function uploadViaPresign(
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
        contentType,
    });

    const presignResponse = await fetch(`/api/blob/presign?${params.toString()}`, {
        method: 'POST',
    });
    const presignData = await parseJsonResponse<{
        uploadUrl?: string;
        url?: string;
        pathname?: string;
        error?: string;
        details?: string;
    }>(presignResponse);

    if (!presignResponse.ok || !presignData.uploadUrl || !presignData.url || !presignData.pathname) {
        throw new Error(
            presignData.error ||
                presignData.details ||
                `Failed to prepare upload (${presignResponse.status})`
        );
    }

    const uploadResponse = await fetch(presignData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': contentType,
        },
    });

    if (!uploadResponse.ok) {
        const errText = (await uploadResponse.text().catch(() => '')).trim();
        throw new Error(
            errText ||
                `Direct R2 upload failed (${uploadResponse.status}). Ensure the R2 bucket CORS policy allows PUT from this site.`
        );
    }

    return {
        url: presignData.url,
        pathname: presignData.pathname,
    };
}

export async function uploadToBlob(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    if (file.size > PROXY_UPLOAD_MAX_BYTES) {
        return uploadViaPresign(file, filename, folder, options);
    }

    try {
        return await uploadViaProxy(file, filename, folder, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        // If the edge/platform rejected the body as too large, fall back to direct upload
        if (/entity too large|413|too large|non-JSON response: Request En/i.test(message)) {
            return uploadViaPresign(file, filename, folder, options);
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
