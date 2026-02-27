'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { authAtom } from '@/atoms/auth';

const SESSION_CHECK_INTERVAL_MS = 5 * 60 * 1000; // Check every 5 minutes

export function SessionMonitor() {
  const router = useRouter();
  const setAuth = useSetAtom(authAtom);

  useEffect(() => {
    const checkSession = async () => {
      // If offline, don't try to check session or redirect
      if (!navigator.onLine) {
        console.log('Skipping session check: Offline');
        return;
      }

      try {
        console.log('checking session', new Date().toISOString());
        const res = await fetch('/api/session');

        if (!res.ok) {
          // Possible server error, but if we're online and get a 500,
          // we might want to stay logged in with cached data for a bit?
          // For now, let's just log it.
          console.error('Session check API failed');
          return;
        }

        const data = await res.json();

        if (data.authenticated === false) {
          console.log('Session expired or nonexistent, redirecting to login...', data.message);
          setAuth({ isAuthenticated: false, user: null, lastChecked: new Date().toISOString() });
          router.push('/auth/login');
        } else {
          // Sync the latest user data to persistent storage
          setAuth({
            isAuthenticated: true,
            user: data.user,
            lastChecked: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Failed to check session', error);
      }
    };

    const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL_MS);

    // Also check immediately on mount
    checkSession();

    return () => clearInterval(interval);
  }, [router, setAuth]);

  return null;
}
