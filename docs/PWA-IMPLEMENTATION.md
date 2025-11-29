# PWA Implementation Guide - Vesper

This document describes the Progressive Web App (PWA) implementation for Vesper, including architecture, usage, and testing guidelines.

## Overview

Vesper implements a complete PWA solution with:
- **Offline-first architecture** using service workers
- **Install prompts** for iOS, Android, and desktop
- **Three caching strategies** for different resource types
- **localStorage integration** for reading history and preferences
- **React hooks** for easy integration

## Architecture

### Core Components

1. **Service Worker** (`/public/service-worker.js`)
   - Handles caching strategies
   - Manages offline functionality
   - Version-based cache management

2. **PWA Utilities** (`/lib/pwa.ts`)
   - Platform detection (iOS, Android, desktop)
   - Install prompt management
   - Service worker communication
   - Installation state tracking

3. **React Hook** (`/lib/hooks/usePWA.ts`)
   - Convenient React integration
   - Installation state management
   - Online/offline detection
   - Update notifications

4. **Storage System** (`/lib/storage.ts`)
   - Type-safe localStorage wrapper
   - User preferences
   - Daily draw tracking
   - Reading history management

## Caching Strategies

### 1. Cache-First (Static Assets)

Used for: JavaScript, CSS, fonts (Satoshi/Erode)

```javascript
// Service worker checks cache first, falls back to network
cache → network → offline fallback
```

### 2. Network-First (API Calls)

Used for: `/api/*` endpoints

```javascript
// Service worker tries network first, falls back to cache
network → cache → error response
```

### 3. Offline Fallback (Navigation)

Used for: Page navigation, reading history

```javascript
// Shows reading history when offline
network → cache → offline page
```

## Usage

### Basic PWA Hook Usage

```typescript
import { usePWA } from '@/lib/hooks/usePWA';

function MyComponent() {
  const {
    // Installation state
    isInstalled,
    canInstall,
    shouldPromptInstall,

    // Platform info
    platform,
    canAutoPrompt,
    installInstructions,

    // Service worker state
    isServiceWorkerReady,
    isUpdateAvailable,

    // Offline state
    isOnline,

    // Actions
    promptInstall,
    dismissPrompt,
    reloadForUpdate,
  } = usePWA();

  // Show install prompt after first reading
  if (shouldPromptInstall) {
    return (
      <div>
        <button onClick={promptInstall}>Install Vesper</button>
        <button onClick={dismissPrompt}>Not now</button>
      </div>
    );
  }

  return null;
}
```

### Direct PWA Utility Usage

```typescript
import {
  registerServiceWorker,
  showInstallPrompt,
  isStandalone,
  isIOS,
  isAndroid,
} from '@/lib/pwa';

// Register service worker
await registerServiceWorker();

// Check if already installed
if (isStandalone()) {
  console.log('App is installed');
}

// Show install prompt
const result = await showInstallPrompt();
if (result === 'accepted') {
  console.log('User installed the app');
}
```

### Storage System Usage

```typescript
import {
  setPreference,
  getPreference,
  addReading,
  getReadingHistory,
} from '@/lib/storage';

// User preferences
setPreference('theme', 'dawn');
const theme = getPreference('theme');

// Reading history
const reading = addReading({
  spreadType: 'three-card',
  cards: [...],
  tags: ['career', 'anxious'],
  shared: false,
});

const history = getReadingHistory();
```

## Installation Flow

### Android / Desktop (Auto-prompt available)

1. User completes first reading
2. System checks if prompt should be shown
3. Native install prompt appears
4. User accepts → App installed
5. User dismisses → Won't show again for 30 days

### iOS (Manual installation)

1. User completes first reading
2. Custom UI shows installation instructions
3. Instructions guide user through Safari share menu
4. User follows steps to add to home screen

## Platform-Specific Considerations

### iOS

- No auto-prompt support
- Requires Safari
- Uses custom instructions UI
- Status bar styling via `apple-mobile-web-app-status-bar-style`
- Special viewport settings for standalone mode

### Android

- Auto-prompt supported
- Works in Chrome, Edge, Samsung Internet
- Maskable icon support
- Native install banner

### Desktop

- Auto-prompt in Chrome, Edge
- Install via browser menu or address bar
- Window management controls

## Manifest Configuration

Location: `/public/manifest.json`

Key properties:
- **Name**: "Vesper"
- **Theme color**: `#7A6CFF` (primary ultramarine)
- **Background**: `#05060A` (N0 neutral)
- **Display**: `standalone`
- **Icons**: 192x192, 512x512 (standard and maskable)

## Icon Requirements

### Standard Icons
- `icon-192x192.png` - Regular app icon
- `icon-512x512.png` - High-res app icon

### Maskable Icons
- `icon-192x192-maskable.png` - Adaptive icon with safe zone
- `icon-512x512-maskable.png` - High-res adaptive icon

**Safe zone**: Keep important content within 80% of canvas (40% radius from center)

## Service Worker Events

### Install
Caches static assets immediately

### Activate
Cleans up old cache versions

### Fetch
Routes requests to appropriate caching strategy

### Message
Handles communication with app:
- `SKIP_WAITING` - Activate new service worker
- `CACHE_READING` - Cache reading for offline
- `GET_VERSION` - Get service worker version

## Testing

### Local Testing

1. **Start dev server**
   ```bash
   npm run dev
   ```

2. **Open Chrome DevTools**
   - Go to Application → Service Workers
   - Check "Update on reload"
   - Verify service worker registration

3. **Test offline**
   - Go to Application → Service Workers
   - Check "Offline"
   - Navigate the app
   - Verify reading history works offline

### iOS Testing (Real Device)

1. Deploy to HTTPS endpoint (required for service workers)
2. Open in Safari on iOS device
3. Tap Share → Add to Home Screen
4. Open from home screen
5. Verify standalone mode
6. Test offline functionality

### Android Testing (Real Device)

1. Deploy to HTTPS endpoint
2. Open in Chrome on Android device
3. Wait for install prompt or tap menu → "Install app"
4. Install and open
5. Test offline functionality

### Desktop Testing

1. Deploy to HTTPS or use localhost
2. Open in Chrome/Edge
3. Look for install icon in address bar
4. Install app
5. Test as standalone window

## Debugging

### Service Worker Console

```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('Registration:', reg);
  console.log('Active worker:', reg.active);
});
```

### Cache Inspection

```javascript
// List all caches
caches.keys().then(keys => console.log('Caches:', keys));

// Inspect cache contents
caches.open('vesper-static-v1').then(cache => {
  cache.keys().then(keys => console.log('Cached files:', keys));
});
```

### Clear Service Worker

```javascript
// Unregister service worker
navigator.serviceWorker.getRegistration().then(reg => {
  reg?.unregister();
});

// Clear all caches
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

## Performance Considerations

### Cache Limits

- **Static cache**: Unlimited (only static assets)
- **Dynamic cache**: Max 50 items (LRU eviction)
- **Offline cache**: Max 100 readings

### Cache Invalidation

- New service worker version automatically clears old caches
- Dynamic cache uses LRU (Least Recently Used) eviction
- Can manually clear via cache API

### Network Performance

- Static assets served from cache (instant)
- API calls try network first (fresh data)
- Offline fallbacks ensure app never crashes

## Security

- Service workers require HTTPS (except localhost)
- Same-origin policy enforced
- No sensitive data in service worker
- localStorage only stores non-sensitive user data

## Future Enhancements

### Planned Features

1. **Background Sync**
   - Sync readings when connection restored
   - Queue failed API calls

2. **Push Notifications**
   - Daily reading reminders
   - Custom notification times

3. **Periodic Background Sync**
   - Update tarot card of the day
   - Refresh cached content

4. **Share Target API**
   - Share readings to other apps
   - Receive shared content

## Troubleshooting

### Service worker not registering

- Check HTTPS (required for production)
- Verify `/service-worker.js` is accessible
- Check browser console for errors
- Clear cache and hard reload

### Install prompt not showing

- Check `shouldShowInstallPrompt()` conditions
- Verify not in standalone mode
- Check if previously dismissed (30-day cooldown)
- Ensure service worker is registered

### Offline mode not working

- Verify service worker is active
- Check Application → Cache Storage
- Ensure resources are cached
- Test network offline in DevTools

### Icons not displaying

- Verify icon files exist in `/public/icons/`
- Check manifest.json paths
- Ensure correct sizes and formats
- Test in Application → Manifest in DevTools

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (Advanced SW library)](https://developers.google.com/web/tools/workbox)
