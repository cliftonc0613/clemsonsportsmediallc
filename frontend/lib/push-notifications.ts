/**
 * Web Push Notifications Library
 *
 * Handles push notification subscription, permission management,
 * and localStorage persistence for Clemson Sports Media.
 *
 * Usage:
 * 1. Check support: isPushSupported()
 * 2. Check permission: getNotificationPermission()
 * 3. Request permission: requestNotificationPermission()
 * 4. Subscribe: subscribeToPush()
 */

// VAPID public key - must match the private key on the server
// Generate new keys with: npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BHcZnEQauTdkQIRLQmOFj_9MVQTHfQfWlisKNpiE5m7OyGYMoUhmJj18X4XLV3ZqKUojHzhL2S7UJGrkWPJqIcc";

// localStorage keys
const STORAGE_KEYS = {
  SUBSCRIPTION: "csm-push-subscription",
  DISMISSED: "csm-push-dismissed",
  DISMISSED_UNTIL: "csm-push-dismissed-until",
} as const;

/**
 * Check if push notifications are supported in this browser
 */
export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Get current notification permission state
 */
export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported in this browser");
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Convert VAPID key from base64url to Uint8Array
 * Returns ArrayBuffer for compatibility with PushSubscriptionOptionsInit
 */
function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer;
}

/**
 * Subscribe to push notifications
 * Returns the subscription object to send to your server
 */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    throw new Error("Push notifications are not supported");
  }

  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Store subscription in localStorage
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(subscription.toJSON()));

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
    throw error;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTION);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Failed to unsubscribe from push notifications:", error);
    return false;
  }
}

/**
 * Get stored subscription from localStorage
 */
export function getStoredSubscription(): PushSubscriptionJSON | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if user has dismissed the notification prompt
 */
export function isPromptDismissed(): boolean {
  if (typeof window === "undefined") return true;

  // Check if permanently dismissed
  if (localStorage.getItem(STORAGE_KEYS.DISMISSED) === "true") {
    return true;
  }

  // Check if temporarily dismissed (7 days)
  const dismissedUntil = localStorage.getItem(STORAGE_KEYS.DISMISSED_UNTIL);
  if (dismissedUntil) {
    const dismissedDate = new Date(dismissedUntil);
    if (dismissedDate > new Date()) {
      return true;
    }
    // Clear expired dismissal
    localStorage.removeItem(STORAGE_KEYS.DISMISSED_UNTIL);
  }

  return false;
}

/**
 * Dismiss the notification prompt
 * @param permanent - If true, never show again. If false, show again after 7 days.
 */
export function dismissPrompt(permanent: boolean = false): void {
  if (typeof window === "undefined") return;

  if (permanent) {
    localStorage.setItem(STORAGE_KEYS.DISMISSED, "true");
    localStorage.removeItem(STORAGE_KEYS.DISMISSED_UNTIL);
  } else {
    const dismissUntil = new Date();
    dismissUntil.setDate(dismissUntil.getDate() + 7);
    localStorage.setItem(STORAGE_KEYS.DISMISSED_UNTIL, dismissUntil.toISOString());
  }
}

/**
 * Reset prompt dismissal (for testing)
 */
export function resetPromptDismissal(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEYS.DISMISSED);
  localStorage.removeItem(STORAGE_KEYS.DISMISSED_UNTIL);
}

/**
 * Check if user should be shown the notification prompt
 * Returns true if:
 * - Push is supported
 * - Permission is "default" (not yet asked)
 * - User hasn't dismissed the prompt
 */
export function shouldShowPrompt(): boolean {
  if (!isPushSupported()) return false;
  if (getNotificationPermission() !== "default") return false;
  if (isPromptDismissed()) return false;

  return true;
}
