/**
 * Firebase Cloud Messaging configuration and utilities for Vesper.
 *
 * This module handles:
 * - Firebase initialization
 * - Push notification permissions
 * - FCM token management
 * - Service worker registration
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// VAPID key for web push
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

/**
 * Initialize Firebase app and messaging service.
 * Only initializes once, returns existing instance on subsequent calls.
 */
export function initializeFirebase(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    // Firebase only works in browser context
    return null;
  }

  if (!app) {
    try {
      // Check if already initialized
      const existingApps = getApps();
      if (existingApps.length > 0) {
        app = existingApps[0];
      } else {
        app = initializeApp(firebaseConfig);
      }
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      return null;
    }
  }

  return app;
}

/**
 * Get Firebase Cloud Messaging instance.
 * Initializes Firebase if not already done.
 */
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!messaging) {
    const firebaseApp = initializeFirebase();
    if (firebaseApp) {
      try {
        messaging = getMessaging(firebaseApp);
      } catch (error) {
        console.error('Error getting messaging instance:', error);
        return null;
      }
    }
  }

  return messaging;
}

/**
 * Request notification permission from the user.
 * Returns the permission status.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    console.warn('Notifications not supported in this environment');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

/**
 * Get the FCM registration token.
 * Requests notification permission if not already granted.
 *
 * @returns FCM token string or null if failed
 */
export async function getFCMToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Check if permission already granted
    const currentPermission = Notification.permission;

    if (currentPermission === 'denied') {
      console.warn('Notification permission denied');
      return null;
    }

    // Request permission if needed
    if (currentPermission === 'default') {
      const permission = await requestNotificationPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return null;
      }
    }

    // Get messaging instance
    const messagingInstance = getFirebaseMessaging();
    if (!messagingInstance) {
      console.error('Could not get messaging instance');
      return null;
    }

    // Get FCM token
    const token = await getToken(messagingInstance, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('FCM token obtained:', token.substring(0, 20) + '...');
      return token;
    } else {
      console.warn('No FCM token available');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

/**
 * Subscribe to foreground messages (when app is open).
 *
 * @param callback Function to call when message received
 * @returns Unsubscribe function
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): (() => void) | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    return null;
  }

  try {
    return onMessage(messagingInstance, callback);
  } catch (error) {
    console.error('Error setting up foreground message listener:', error);
    return null;
  }
}

/**
 * Check if notifications are supported in the current environment.
 */
export function areNotificationsSupported(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status.
 */
export function getNotificationPermissionStatus(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }

  return Notification.permission;
}

/**
 * Subscribe user to push notifications.
 * Handles the full flow: permission, token, and API registration.
 *
 * @returns Success status and token if successful
 */
export async function subscribeToNotifications(): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> {
  try {
    // Check support
    if (!areNotificationsSupported()) {
      return {
        success: false,
        error: 'Notifications not supported in this browser',
      };
    }

    // Get FCM token (handles permission request)
    const token = await getFCMToken();

    if (!token) {
      return {
        success: false,
        error: 'Could not obtain FCM token',
      };
    }

    // Send token to backend
    const response = await fetch('/api/py/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    if (!response.ok) {
      throw new Error('Failed to subscribe on server');
    }

    return {
      success: true,
      token,
    };
  } catch (error) {
    console.error('Error subscribing to notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Unsubscribe user from push notifications.
 *
 * @param token FCM token to unsubscribe
 */
export async function unsubscribeFromNotifications(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/py/notifications/unsubscribe', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fcm_token: token }),
    });

    if (!response.ok) {
      throw new Error('Failed to unsubscribe on server');
    }

    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from notifications:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
