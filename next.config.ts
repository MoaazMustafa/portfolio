import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.githubassets.com',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
