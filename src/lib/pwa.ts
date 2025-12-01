/**
 * PWA Installation and Service Worker Management
 * Handles PWA install prompts, service worker registration, and platform detection
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// ============================================================================
// Platform Detection
// ============================================================================

/**
 * Detects if the user is on iOS
 */
export function isIOS(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/**
 * Detects if the user is on Android
 */
export function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/.test(navigator.userAgent);
}

/**
 * Detects if the app is already installed (standalone mode)
 */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Checks if the browser supports PWA installation
 */
export function isPWASupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator;
}

// ============================================================================
// Service Worker Registration
// ============================================================================

/**
 * Registers the service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPWASupported()) {
    console.warn('[PWA] Service workers are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('[PWA] Service worker registered:', registration.scope);

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New service worker available');
            // Optionally notify user about update
            dispatchUpdateEvent();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Unregisters the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!isPWASupported()) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('[PWA] Service worker unregistered');
      return true;
    }
    return false;
  } catch (error) {
    console.error('[PWA] Service worker unregistration failed:', error);
    return false;
  }
}

/**
 * Dispatches a custom event when a service worker update is available
 */
function dispatchUpdateEvent(): void {
  window.dispatchEvent(new CustomEvent('sw-update-available'));
}

// ============================================================================
// Install Prompt Management
// ============================================================================

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Sets up the beforeinstallprompt event listener
 */
export function setupInstallPrompt(
  callback?: (event: BeforeInstallPromptEvent) => void
): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt
    e.preventDefault();

    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;

    console.log('[PWA] Install prompt available');

    // Call optional callback
    if (callback) {
      callback(deferredPrompt);
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed');
    deferredPrompt = null;
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
}

/**
 * Shows the install prompt
 */
export async function showInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return 'unavailable';
  }

  try {
    // Show the prompt
    await deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`[PWA] User ${outcome} the install prompt`);

    // Clear the deferred prompt
    deferredPrompt = null;

    return outcome;
  } catch (error) {
    console.error('[PWA] Error showing install prompt:', error);
    return 'unavailable';
  }
}

/**
 * Checks if the install prompt is available
 */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}

// ============================================================================
// Install Prompt Timing
// ============================================================================

const INSTALL_PROMPT_STORAGE_KEY = 'vesper_install_prompt';

interface InstallPromptState {
  dismissed: boolean;
  dismissedAt: number | null;
  shownCount: number;
}

/**
 * Gets the install prompt state from localStorage
 */
export function getInstallPromptState(): InstallPromptState {
  if (typeof window === 'undefined') {
    return { dismissed: false, dismissedAt: null, shownCount: 0 };
  }

  try {
    const stored = localStorage.getItem(INSTALL_PROMPT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('[PWA] Error reading install prompt state:', error);
  }

  return { dismissed: false, dismissedAt: null, shownCount: 0 };
}

/**
 * Saves the install prompt state to localStorage
 */
export function setInstallPromptState(state: Partial<InstallPromptState>): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getInstallPromptState();
    const updated = { ...current, ...state };
    localStorage.setItem(INSTALL_PROMPT_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[PWA] Error saving install prompt state:', error);
  }
}

/**
 * Checks if we should show the install prompt
 * Logic: Show after first reading completes, unless user dismissed it
 */
export function shouldShowInstallPrompt(): boolean {
  // Don't show if already installed
  if (isStandalone()) {
    return false;
  }

  // Don't show if prompt not available
  if (!isInstallPromptAvailable()) {
    return false;
  }

  // Check if user previously dismissed
  const state = getInstallPromptState();
  if (state.dismissed) {
    // Don't show again for 30 days after dismissal
    if (state.dismissedAt) {
      const daysSinceDismissal = (Date.now() - state.dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 30) {
        return false;
      }
    }
  }

  // Don't show more than 3 times total
  if (state.shownCount >= 3) {
    return false;
  }

  return true;
}

/**
 * Marks the install prompt as dismissed
 */
export function dismissInstallPrompt(): void {
  setInstallPromptState({
    dismissed: true,
    dismissedAt: Date.now(),
  });
}

/**
 * Increments the shown count for the install prompt
 */
export function incrementInstallPromptShown(): void {
  const state = getInstallPromptState();
  setInstallPromptState({
    shownCount: state.shownCount + 1,
  });
}

// ============================================================================
// iOS Install Instructions
// ============================================================================

/**
 * Gets platform-specific install instructions
 */
export function getInstallInstructions(): {
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  canAutoPrompt: boolean;
  instructions: string[];
} {
  if (isIOS()) {
    return {
      platform: 'ios',
      canAutoPrompt: false,
      instructions: [
        'Tap the Share button',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install Vesper',
      ],
    };
  }

  if (isAndroid()) {
    return {
      platform: 'android',
      canAutoPrompt: true,
      instructions: [
        'Tap the menu button (⋮)',
        'Tap "Install app" or "Add to Home screen"',
        'Follow the prompts to install',
      ],
    };
  }

  if (isInstallPromptAvailable()) {
    return {
      platform: 'desktop',
      canAutoPrompt: true,
      instructions: [
        'Click the install button in your browser\'s address bar',
        'Or use the prompt to install Vesper',
      ],
    };
  }

  return {
    platform: 'unknown',
    canAutoPrompt: false,
    instructions: [],
  };
}

// ============================================================================
// Service Worker Communication
// ============================================================================

/**
 * Sends a message to the service worker
 */
export async function sendMessageToSW(message: any): Promise<void> {
  const controller = navigator.serviceWorker.controller;

  if (!controller) {
    console.warn('[PWA] No service worker controller available');
    return;
  }

  controller.postMessage(message);
}

/**
 * Caches a reading for offline access
 */
export async function cacheReading(reading: any): Promise<void> {
  await sendMessageToSW({
    type: 'CACHE_READING',
    reading,
  });
}

/**
 * Gets the current service worker version
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  const controller = navigator.serviceWorker.controller;

  if (!controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.version || null);
    };

    controller.postMessage({ type: 'GET_VERSION' }, [messageChannel.port2]);
  });
}
