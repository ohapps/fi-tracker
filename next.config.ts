import type { NextConfig } from 'next';
import { withSerwist } from '@serwist/turbopack';
import { withSentryConfig } from '@sentry/nextjs';

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

// First wrap with Serwist, then with Sentry
const serwistConfig = withSerwist(nextConfig);

export default withSentryConfig(serwistConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during bundling
  silent: true,
  org: 'fi-tracker',
  project: 'fi-tracker',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Routes HTTP requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
