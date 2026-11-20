/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'images.pexels.com' },
            { protocol: 'https', hostname: '**.r2.dev' },
            { protocol: 'https', hostname: '**.cloudflarestorage.com' },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    typescript: {
        // Existing project setting — keep builds unblocked while types catch up
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
