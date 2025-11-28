'use client';

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '../ui/sidebar';

function toInitCase(path: string) {
  const firstSegment = path.replace(/^\/|\/$/g, '').split('/')[0];
  if (!firstSegment) return 'Home';
  return firstSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function AppHeader() {
  const pathname = usePathname();
  const pageTitle = toInitCase(pathname);

  return (
    <header className="border-b border-border px-4 h-14 flex items-center gap-2 bg-sky-50">
      <SidebarTrigger />
      <h1 className="font-medium">{pageTitle}</h1>
    </header>
  );
}
