'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Extend the Navigator interface for iOS compatibility checks
interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

interface WindowWithMSStream extends Window {
  MSStream?: unknown;
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if on iOS
    const windowWithMSStream = window as unknown as WindowWithMSStream;
    const ios = /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !windowWithMSStream.MSStream;
    setIsIos(ios);

    // Check if already installed
    const navigatorWithStandalone = window.navigator as NavigatorWithStandalone;
    const installed =
      window.matchMedia('(display-mode: standalone)').matches ||
      navigatorWithStandalone.standalone === true;

    if (installed) {
      setIsInstalled(true);
    } else if (ios) {
      // If on iOS and not installed, it is "installable" (via manual instructions)
      setIsInstallable(true);
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const appInstalledHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const installPwa = async () => {
    if (isIos) {
      // On iOS, this is handled by showing a dialog in the component
      return;
    }

    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the PWA install');
      } else {
        console.log('User dismissed the PWA install');
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    } finally {
      // We've used the prompt (or it failed), and can't use it again, throw it away
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, isInstalled, isIos, installPwa };
}
