/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    appDir: true,
  },
  // Optimizations for Netlify
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Handle static export
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  reactStrictMode: true,
  // Add CORS headers
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 