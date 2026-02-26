import { createSerwistRoute } from '@serwist/turbopack';

const { GET } = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
});

export { GET };
export const dynamic = 'force-static';
