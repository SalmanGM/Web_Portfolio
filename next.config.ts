import type { NextConfig } from 'next';

// Static export: `next build` writes a plain site to /out that any static host can serve.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true
};

export default nextConfig;
