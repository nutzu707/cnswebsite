/** @type {import('next').NextConfig} */

module.exports = {
    webpack(config, { isServer }) {
        if (!isServer) {
            config.performance = {
                maxAssetSize: 100000,
                maxEntrypointSize: 100000,
            };
        }
        return config;
    },


    experimental: {
        serverActions: {
            bodySizeLimit: '256mb',
        },
    },
    typescript: {
        ignoreBuildErrors: true,
    },



}