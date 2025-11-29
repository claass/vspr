/**
 * Vesper Service Worker
 * Implements caching strategies for PWA functionality
 */

const CACHE_VERSION = 'v1';
const STATIC_CACHE = `vesper-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `vesper-dynamic-${CACHE_VERSION}`;
const OFFLINE_CACHE = `vesper-offline-${CACHE_VERSION}`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Font files (Satoshi/Erode) - these will be added dynamically
const FONT_PATTERNS = [
  /\.woff2?$/,
  /fonts\//,
];

// API patterns
const API_PATTERN = /\/api\//;

// Maximum cache sizes
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_OFFLINE_CACHE_SIZE = 100;

// ============================================================================
// Install Event - Cache static assets
// ============================================================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// ============================================================================
// Activate Event - Clean up old caches
// ============================================================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Remove old versions of caches
              return (
                cacheName.startsWith('vesper-') &&
                cacheName !== STATIC_CACHE &&
                cacheName !== DYNAMIC_CACHE &&
                cacheName !== OFFLINE_CACHE
              );
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// ============================================================================
// Fetch Event - Route requests to appropriate caching strategy
// ============================================================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Route to appropriate strategy
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirstStrategy(request));
  } else if (isApiRequest(request)) {
    event.respondWith(networkFirstStrategy(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(navigationStrategy(request));
  } else {
    event.respondWith(dynamicCacheStrategy(request));
  }
});

// ============================================================================
// Caching Strategies
// ============================================================================

/**
 * Cache-First Strategy
 * Used for: Static assets (JS, CSS, fonts)
 * Try cache first, fall back to network
 */
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache-first strategy failed:', error);
    // Return a basic offline response for assets
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

/**
 * Network-First Strategy
 * Used for: API calls
 * Try network first, fall back to cache
 */
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return error response for API calls
    return new Response(
      JSON.stringify({ error: 'Network unavailable', offline: true }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * Navigation Strategy
 * Used for: Page navigation
 * Network first with offline fallback
 */
async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation failed, showing offline page');
    // Try to show cached version of the page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Fall back to offline page
    const offlinePage = await caches.match('/offline');
    if (offlinePage) {
      return offlinePage;
    }
    // Last resort: basic offline message
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offline - Vesper</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #05060A;
            color: #EBF3FF;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 1rem;
            text-align: center;
          }
          h1 { color: #7A6CFF; }
          p { color: #CBD4E7; }
        </style>
      </head>
      <body>
        <div>
          <h1>You're Offline</h1>
          <p>Vesper is unable to connect to the network.</p>
          <p>Please check your connection and try again.</p>
        </div>
      </body>
      </html>`,
      {
        status: 503,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}

/**
 * Dynamic Cache Strategy
 * Used for: Other resources
 */
async function dynamicCacheStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      trimCache(DYNAMIC_CACHE, MAX_DYNAMIC_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Resource not available offline', { status: 503 });
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Checks if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check for static file extensions
  if (
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.ttf') ||
    pathname.match(/_next\/static\//)
  ) {
    return true;
  }

  // Check for font patterns
  return FONT_PATTERNS.some((pattern) => pattern.test(pathname));
}

/**
 * Checks if request is for an API endpoint
 */
function isApiRequest(request) {
  return API_PATTERN.test(request.url);
}

/**
 * Checks if request is a navigation request
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

/**
 * Trims cache to maximum size by removing oldest entries
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > maxItems) {
    const itemsToDelete = keys.length - maxItems;
    for (let i = 0; i < itemsToDelete; i++) {
      await cache.delete(keys[i]);
    }
    console.log(`[SW] Trimmed ${itemsToDelete} items from ${cacheName}`);
  }
}

// ============================================================================
// Message Event - Handle messages from clients
// ============================================================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_READING') {
    // Cache reading data for offline access
    const { reading } = event.data;
    caches.open(OFFLINE_CACHE).then((cache) => {
      const response = new Response(JSON.stringify(reading), {
        headers: { 'Content-Type': 'application/json' },
      });
      cache.put(`/reading/${reading.id}`, response);
      trimCache(OFFLINE_CACHE, MAX_OFFLINE_CACHE_SIZE);
    });
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// ============================================================================
// Background Sync (future enhancement)
// ============================================================================

// self.addEventListener('sync', (event) => {
//   if (event.tag === 'sync-readings') {
//     event.waitUntil(syncReadings());
//   }
// });

console.log('[SW] Service worker loaded');
