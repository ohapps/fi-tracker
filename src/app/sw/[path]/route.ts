import { createSerwistRoute } from '@serwist/turbopack';
import path from 'node:path';
import fs from 'node:fs';

const { GET: serwistGET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
});

export const GET = async (request: Request, context: { params: Promise<{ path: string }> }) => {
  // Tracing hint for Vercel NFT (Node File Trace).
  // This explicitly references the internal Next.js config module required by Serwist
  // at runtime, ensuring it's included in the production serverless bundle
  // without triggering Turbopack's strict build-time dependency checks.
  if (process.env.NODE_ENV === 'production') {
    const _configPath = path.join(process.cwd(), 'node_modules/next/dist/server/config.js');
    try {
      if (fs.existsSync(_configPath)) {
        // Just a hint for the tracer.
      }
    } catch {
      // Ignore errors during tracing hint
    }
  }

  return serwistGET(request, context);
};

export const dynamic = 'force-static';
