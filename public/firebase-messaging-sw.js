/**
 * Firebase Cloud Messaging Service Worker
 *
 * This service worker handles background push notifications
 * when the web app is not in focus.
 */

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
// These values will be replaced at build time or loaded from environment
firebase.initializeApp({
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "PLACEHOLDER_AUTH_DOMAIN",
  projectId: "PLACEHOLDER_PROJECT_ID",
  storageBucket: "PLACEHOLDER_STORAGE_BUCKET",
  messagingSenderId: "PLACEHOLDER_MESSAGING_SENDER_ID",
  appId: "PLACEHOLDER_APP_ID"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  // Customize notification
  const notificationTitle = payload.notification?.title || 'Vesper';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: payload.notification?.icon || '/icon-192x192.png',
    badge: payload.notification?.badge || '/badge-72x72.png',
    tag: payload.notification?.tag || 'vesper-notification',
    data: payload.data || {},
    // Action buttons (optional)
    // actions: [
    //   { action: 'open', title: 'Open App' },
    //   { action: 'dismiss', title: 'Dismiss' }
    // ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  // Handle action button clicks
  if (event.action === 'dismiss') {
    return;
  }

  // Open the app or focus existing tab
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if none exists
      if (clients.openWindow) {
        const urlToOpen = event.notification.data?.link || '/';
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
