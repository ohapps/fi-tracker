import { createSerwistRoute } from '@serwist/turbopack';
// Force Next.js to trace and include the internal config module required by Serwist at runtime
import 'next/dist/server/config';

const { GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
});

export { GET };
export const dynamic = 'force-static';
