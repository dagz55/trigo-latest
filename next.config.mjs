/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nlkxmqyhrrezjhoztlxy.supabase.co'],
    unoptimized: true
  },
  // Simplified experimental flags
  experimental: {
    webpackBuildWorker: false
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.fallback = { 
      fs: false,
      path: false
    };
    return config;
  }
}

export default nextConfig;
