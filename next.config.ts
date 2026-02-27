import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/sw/sw.js',
      },
      {
        source: '/sw.js.map',
        destination: '/sw/sw.js.map',
      },
    ];
  },
  serverExternalPackages: ['esbuild', 'esbuild-wasm'],
};

export default withSerwist(nextConfig);
