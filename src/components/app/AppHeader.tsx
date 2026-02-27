'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '../ui/sidebar';
import { PwaInstallButton } from './PwaInstallButton';
import { useIsOffline } from '@/hooks/use-is-offline';
import { WifiOff } from 'lucide-react';

function toInitCase(path: string) {
  const firstSegment = path.replace(/^\/|\/$/g, '').split('/')[0];
  if (!firstSegment) return 'Home';
  return firstSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function AppHeader() {
  const isOffline = useIsOffline();
  const pathname = usePathname();
  const pageTitle = toInitCase(pathname);

  return (
    <header className="border-b border-border px-4 h-14 flex items-center justify-between bg-sky-50">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="font-medium">{pageTitle}</h1>
        {isOffline && (
          <div className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-destructive/20 ml-2">
            <WifiOff className="w-3 h-3" />
            OFFLINE MODE
          </div>
        )}
      </div>
      <PwaInstallButton />
    </header>
  );
}
