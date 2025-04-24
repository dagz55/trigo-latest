/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    // Only disable the cache for client-side development
    // This is a more targeted approach than disabling caching entirely
    if (!isServer && process.env.NODE_ENV === 'development') {
      // Set more tolerant cache options
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
        cacheDirectory: path.resolve(__dirname, '.next/cache'),
        compression: false, // Disable compression to avoid file rename issues
        maxAge: 5184000000, // 60 days
      };
    }
    return config;
  },
  // Add experimental features to improve stability
  experimental: {
    optimizeCss: false, // Disable optimizeCss to prevent critters issues
  },
  // More specific configuration for build issues
  poweredByHeader: false,
};

module.exports = nextConfig;