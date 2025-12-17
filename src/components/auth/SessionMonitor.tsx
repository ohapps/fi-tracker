'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_CHECK_INTERVAL_MS = 60 * 5000; // Check every 60 seconds

export function SessionMonitor() {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                console.log('checking session', new Date().toISOString());
                const res = await fetch('/api/session');
                if (!res.ok) {
                    return;
                }

                const data = await res.json();

                if (data.authenticated === false) {
                    console.log('Session expired or nonexistent, redirecting to login...', data.message);
                    router.push('/auth/login');
                }

            } catch (error) {
                console.error('Failed to check session', error);
            }
        };

        const interval = setInterval(checkSession, SESSION_CHECK_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [router]);

    return null;
}
