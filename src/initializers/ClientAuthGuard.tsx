'use client';

import { useAtomValue } from 'jotai';
import { authAtom } from '@/atoms/auth';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const auth = useAtomValue(authAtom);
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // If we're on a public page, don't redirect
    if (pathname === '/auth/login' || pathname === '/~offline') {
      return;
    }

    // If we are offline and not authenticated in the persistent store,
    // we should probably show the offline page or login if it's allowed.
    // We check lastChecked to ensure we don't redirect while the atom is
    // still in its initial state (synchronizing from storage).
    if (!auth.isAuthenticated && auth.lastChecked !== null && !navigator.onLine) {
      router.push('/~offline');
    }

    // If we are online and not authenticated, AuthInitializer (server)
    // should have already handled the redirect, but this is a safety net
    // for client-side state transitions.
    if (!auth.isAuthenticated && navigator.onLine) {
      // Only redirect if we are sure we aren't in a transition or something
      // router.push('/auth/login');
    }
  }, [auth.isAuthenticated, auth.lastChecked, mounted, pathname, router]);

  // Don't render until mounted to avoid hydration mismatch with localStorage
  if (!mounted) {
    return null;
  }

  return <>{children}</>;
}
