/**
 * PWA Initializer Component
 * Client-side component that initializes the service worker
 */

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/pwa';

export function PWAInitializer() {
  useEffect(() => {
    // Register service worker on mount
    registerServiceWorker().then((registration) => {
      if (registration) {
        console.log('[PWA] Service worker registered successfully');
      }
    });
  }, []);

  // This component doesn't render anything
  return null;
}
