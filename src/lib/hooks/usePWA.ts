/**
 * React hook for PWA functionality
 * Manages service worker registration, install prompts, and offline status
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  registerServiceWorker,
  setupInstallPrompt,
  showInstallPrompt,
  isInstallPromptAvailable,
  shouldShowInstallPrompt,
  dismissInstallPrompt,
  incrementInstallPromptShown,
  isStandalone,
  isIOS,
  isAndroid,
  getInstallInstructions,
  type BeforeInstallPromptEvent,
} from '../pwa';

export interface UsePWAReturn {
  // Installation state
  isInstalled: boolean;
  canInstall: boolean;
  shouldPromptInstall: boolean;

  // Platform detection
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  canAutoPrompt: boolean;
  installInstructions: string[];

  // Service worker state
  isServiceWorkerReady: boolean;
  isUpdateAvailable: boolean;

  // Offline state
  isOnline: boolean;

  // Actions
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  dismissPrompt: () => void;
  reloadForUpdate: () => void;
}

export function usePWA(): UsePWAReturn {
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [shouldPromptInstall, setShouldPromptInstall] = useState(false);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Get platform info
  const installInfo = getInstallInstructions();

  // Initialize service worker
  useEffect(() => {
    const initServiceWorker = async () => {
      const registration = await registerServiceWorker();
      if (registration) {
        setIsServiceWorkerReady(true);
      }
    };

    initServiceWorker();
  }, []);

  // Check if already installed
  useEffect(() => {
    setIsInstalled(isStandalone());
  }, []);

  // Set up install prompt
  useEffect(() => {
    setupInstallPrompt((event: BeforeInstallPromptEvent) => {
      setCanInstall(true);
      setShouldPromptInstall(shouldShowInstallPrompt());
    });

    // Listen for install availability
    const handleInstallAvailable = () => {
      setCanInstall(true);
      setShouldPromptInstall(shouldShowInstallPrompt());
    };

    // Listen for app installed
    const handleInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setShouldPromptInstall(false);
    };

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  // Listen for service worker updates
  useEffect(() => {
    const handleUpdate = () => {
      setIsUpdateAvailable(true);
    };

    window.addEventListener('sw-update-available', handleUpdate);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdate);
    };
  }, []);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Prompt install action
  const promptInstall = useCallback(async () => {
    if (!isInstallPromptAvailable()) {
      return 'unavailable';
    }

    incrementInstallPromptShown();
    const result = await showInstallPrompt();

    if (result === 'accepted') {
      setCanInstall(false);
      setShouldPromptInstall(false);
    }

    return result;
  }, []);

  // Dismiss prompt action
  const dismissPrompt = useCallback(() => {
    dismissInstallPrompt();
    setShouldPromptInstall(false);
  }, []);

  // Reload for update action
  const reloadForUpdate = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    // Installation state
    isInstalled,
    canInstall,
    shouldPromptInstall,

    // Platform detection
    platform: installInfo.platform,
    canAutoPrompt: installInfo.canAutoPrompt,
    installInstructions: installInfo.instructions,

    // Service worker state
    isServiceWorkerReady,
    isUpdateAvailable,

    // Offline state
    isOnline,

    // Actions
    promptInstall,
    dismissPrompt,
    reloadForUpdate,
  };
}
