'use client';

import { useEffect } from 'react';

export default function PwaRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      // @ts-expect-error: serwist is not defined on window
      window.serwist !== undefined
    ) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Serwist Service Worker registered with scope:', registration.scope);
      });
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      });
    }
  }, []);

  return null;
}
