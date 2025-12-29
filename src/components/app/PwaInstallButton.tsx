'use client';

import { usePwaInstall } from '@/hooks/usePwaInstall';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function PwaInstallButton() {
  const { isInstallable, isInstalled, installPwa } = usePwaInstall();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Button
      onClick={installPwa}
      variant="outline"
      size="sm"
      className="gap-2 text-sky-600 border-sky-200 hover:bg-sky-100 bg-white"
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Install App</span>
      <span className="sm:hidden">Install</span>
    </Button>
  );
}
