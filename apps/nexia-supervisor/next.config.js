/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: []
  },
  env: {
    NEXIA_SUPERVISOR_MODE: process.env.NODE_ENV || 'development',
    NEXIA_VOICE_ENABLED: process.env.NEXIA_VOICE_ENABLED || 'true',
    NEXIA_DIRECTUS_URL: process.env.NEXIA_DIRECTUS_URL || 'http://localhost:7012',
    NEXIA_CLAUDE_CODE_24X7: process.env.NEXIA_CLAUDE_CODE_24X7 || 'true'
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  }
}

module.exports = nextConfig