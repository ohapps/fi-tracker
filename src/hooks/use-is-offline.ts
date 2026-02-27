'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function getSnapshot() {
  return typeof navigator !== 'undefined' ? !navigator.onLine : false;
}

function getServerSnapshot() {
  return false; // Assume online for SSR
}

/**
 * Hook to track whether the browser is currently offline.
 * Uses useSyncExternalStore for immediate and reliable synchronization with browser events.
 */
export function useIsOffline() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
