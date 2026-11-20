/**
 * Upload strategy:
 * 1) Prefer direct browser → R2 via presigned PUT (fast; needs bucket CORS)
 * 2) If that fails (CORS / network), fall back to chunked staging through our API
 *    (works without CORS; each chunk stays under Vercel's body limit)
 */

const CHUNK_BYTES = 3 * 1024 * 1024;

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

function resolveContentType(
    file: Blob | File,
    options?: { contentType?: string }
): string {
    return (
        options?.contentType ||
        (file instanceof File && file.type ? file.type : undefined) ||
        'application/octet-stream'
    );
}

async function uploadViaPresign(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    const contentType = resolveContentType(file, options);
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
        throw new Error(errText || `R2 upload failed (${uploadResponse.status})`);
    }

    return {
        url: presignData.url,
        pathname: presignData.pathname,
    };
}

async function uploadViaChunked(
    file: Blob | File,
    filename: string,
    folder: string,
    options?: { overwrite?: boolean; contentType?: string }
): Promise<UploadResult> {
    const contentType = resolveContentType(file, options);
    const overwrite = options?.overwrite ? 'true' : 'false';

    const initParams = new URLSearchParams({
        action: 'init',
        filename,
        folder,
        overwrite,
        contentType,
        totalSize: String(file.size),
    });

    const initResponse = await fetch(`/api/blob/chunked?${initParams.toString()}`, {
        method: 'POST',
    });
    const initData = await parseJsonResponse<{
        sessionId?: string;
        pathname?: string;
        error?: string;
        details?: string;
    }>(initResponse);

    if (!initResponse.ok || !initData.sessionId || !initData.pathname) {
        throw new Error(initData.error || initData.details || `Failed to start chunked upload (${initResponse.status})`);
    }

    const { sessionId, pathname } = initData;
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_BYTES));

    try {
        for (let index = 0; index < totalChunks; index++) {
            const start = index * CHUNK_BYTES;
            const end = Math.min(start + CHUNK_BYTES, file.size);
            const chunk = file.slice(start, end);

            const chunkParams = new URLSearchParams({
                action: 'chunk',
                sessionId,
                index: String(index),
            });

            const chunkResponse = await fetch(`/api/blob/chunked?${chunkParams.toString()}`, {
                method: 'POST',
                body: chunk,
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
            });

            const chunkData = await parseJsonResponse<{ error?: string; details?: string }>(chunkResponse);
            if (!chunkResponse.ok) {
                throw new Error(
                    chunkData.error ||
                        chunkData.details ||
                        `Failed to upload chunk ${index + 1}/${totalChunks}`
                );
            }
        }

        const completeResponse = await fetch('/api/blob/chunked?action=complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                pathname,
                contentType,
                totalChunks,
            }),
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
        try {
            await fetch('/api/blob/chunked?action=abort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId }),
            });
        } catch {
            // ignore cleanup errors
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
    try {
        return await uploadViaPresign(file, filename, folder, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : '';
        // Don't mask auth / conflict errors
        if (/already exists|Unauthorized|401\b|409\b/i.test(message)) {
            throw error;
        }
        // Direct PUT often fails without R2 CORS — chunked API path always works
        return uploadViaChunked(file, filename, folder, options);
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
