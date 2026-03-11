'use client';

import { useEffect } from 'react';

export default function PwaRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('PWA Service Worker registered successfully:', {
            scope: registration.scope,
            active: !!registration.active,
            installing: !!registration.installing,
            waiting: !!registration.waiting,
          });

          // Handle updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('New PWA content is available; please refresh.');
                }
              };
            }
          };
        })
        .catch((error) => {
          console.error('PWA Service Worker registration failed:', error);
        });
    }
  }, []);

  return null;
}
