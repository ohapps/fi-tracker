import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from 'serwist';
import { Serwist, NetworkFirst } from 'serwist';
import { defaultCache } from '@serwist/next/worker';

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: [...(self.__SW_MANIFEST || []), { url: '/~offline', revision: '1' }],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
  runtimeCaching: [
    // Auth Session - Always try network first, fallback to cache
    {
      matcher: ({ url }) => url.pathname === '/api/session',
      handler: new NetworkFirst({
        cacheName: 'auth-session',
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              if (response && response.status === 200) {
                return response;
              }
              return null;
            },
          },
        ],
      }),
    },
    // Generic API data - Network First (prioritize fresh data when online)
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/'),
      handler: new NetworkFirst({
        cacheName: 'api-data-v4',
      }),
    },
    // Page navigations and Next.js RSC data - Network First with fallback
    {
      matcher: ({ request, url, sameOrigin }) =>
        sameOrigin &&
        !url.pathname.startsWith('/api/') &&
        (request.mode === 'navigate' || request.headers.get('RSC') === '1'),
      handler: new NetworkFirst({
        cacheName: 'pages-cache-v4',
        networkTimeoutSeconds: 2,
        matchOptions: {
          ignoreSearch: true,
        },
      }),
    },
    ...(defaultCache as RuntimeCaching[]),
  ],
  fallbacks: {
    entries: [
      {
        url: '/~offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
