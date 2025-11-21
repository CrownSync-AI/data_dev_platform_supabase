/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@supabase/supabase-js'
    ]
  },
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Generate unique build ID to prevent caching issues
  generateBuildId: async () => {
    // Use timestamp to ensure fresh builds
    return `build-${Date.now()}`
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('pg', 'dotenv');
    }
    return config;
  },
};

module.exports = nextConfig;