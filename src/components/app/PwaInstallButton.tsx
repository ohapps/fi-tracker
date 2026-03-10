'use client';

import { usePwaInstall } from '@/hooks/usePwaInstall';
import { Button } from '@/components/ui/button';
import { Download, Share, PlusSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function PwaInstallButton() {
  const { isInstallable, isInstalled, isIos, installPwa } = usePwaInstall();

  if (!isInstallable || isInstalled) {
    return null;
  }

  if (isIos) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sky-600 border-sky-200 hover:bg-sky-100 bg-white"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Install App</span>
            <span className="sm:hidden">Install</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Fi Tracker</DialogTitle>
            <DialogDescription>
              Add this app to your home screen for the best experience on iOS.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                1
              </div>
              <p className="text-sm">
                Tap the <Share className="mx-1 inline h-4 w-4" /> <strong>Share</strong> button in
                Safari.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                2
              </div>
              <p className="text-sm">
                Scroll down and tap <PlusSquare className="mx-1 inline h-4 w-4" />{' '}
                <strong>Add to Home Screen</strong>.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
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
