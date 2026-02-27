'use client';

import Link from 'next/link';
import { Button } from '../ui/button';
import { useIsOffline } from '@/hooks/use-is-offline';

export default function AddInvestmentButton() {
  const isOffline = useIsOffline();

  if (isOffline) {
    return (
      <Button type="button" disabled>
        Offline
      </Button>
    );
  }

  return (
    <Button type="button" asChild>
      <Link href="/investments/new">New</Link>
    </Button>
  );
}
