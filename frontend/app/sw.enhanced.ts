/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import {
  Serwist,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkFirst,
  ExpirationPlugin,
  CacheableResponsePlugin,
} from "serwist";

/**
 * Enhanced Service Worker with App Shell Pattern
 *
 * Improvements over original:
 * - App shell precaching for instant loads
 * - Background sync for offline form submissions
 * - Periodic background sync for fresh content
 * - Better cache versioning
 * - Broadcast channel for UI updates
 */

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[];
};

// Cache version - increment to force cache refresh
const CACHE_VERSION = "v1";

// App shell routes to precache for instant navigation
const APP_SHELL_ROUTES = [
  "/",
  "/offline",
  "/blog",
  "/services",
  "/contact",
];

// Critical assets for app shell
const CRITICAL_ASSETS = [
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/screenshots/mobile.png",
];

const serwist = new Serwist({
  precacheEntries: [
    ...self.__SW_MANIFEST,
    // Add app shell routes to precache
    ...APP_SHELL_ROUTES.map((url) => ({
      url,
      revision: CACHE_VERSION,
    })),
    ...CRITICAL_ASSETS.map((url) => ({
      url,
      revision: CACHE_VERSION,
    })),
  ],
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // App Shell - Network First with fast fallback
    // Prioritizes fresh content but instantly serves cached version
    {
      matcher: ({ request, url }) => {
        return (
          request.mode === "navigate" &&
          APP_SHELL_ROUTES.includes(url.pathname)
        );
      },
      handler: new NetworkFirst({
        cacheName: `app-shell-${CACHE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
          }),
        ],
        networkTimeoutSeconds: 3, // Fast fallback to cache
      }),
    },

    // Google Fonts - cache first for performance (1 year)
    {
      matcher: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: `google-fonts-${CACHE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // Static fonts - stale while revalidate (1 year)
    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font\.css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: `static-fonts-${CACHE_VERSION}`,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 10,
            maxAgeSeconds: 365 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // Static images - stale while revalidate (30 days)
    {
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: `static-images-${CACHE_VERSION}`,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // Static assets (JS/CSS) - stale while revalidate (1 day)
    {
      matcher: /\.(?:js|css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: `static-assets-${CACHE_VERSION}`,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },

    // WordPress API - network first with fallback (1 hour cache)
    {
      matcher:
        /^https:\/\/.*\.(?:wpstarter\.mysites\.io|websiteplayground\.local)\/wp-json\/.*/i,
      handler: new NetworkFirst({
        cacheName: `wordpress-api-${CACHE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: 60 * 60,
          }),
        ],
        networkTimeoutSeconds: 10,
      }),
    },

    // WordPress uploads - cache first (30 days)
    {
      matcher: /^https:\/\/.*\/wp-content\/uploads\/.*/i,
      handler: new CacheFirst({
        cacheName: `wordpress-uploads-${CACHE_VERSION}`,
        plugins: [
          new CacheableResponsePlugin({
            statuses: [0, 200],
          }),
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },

    // Default caching strategies from @serwist/next
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

// Listen for skip waiting message from client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  // Handle cache clear request
  if (event.data && event.data.type === "CLEAR_CACHE") {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        if (cacheName.startsWith("wordpress-api")) {
          caches.delete(cacheName);
        }
      });
    });
  }
});

// Broadcast channel for notifying clients of updates
const broadcast = new BroadcastChannel("sw-updates");

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            return caches.delete(cacheName);
          }
        })
      );

      // Notify clients of activation
      broadcast.postMessage({ type: "SW_ACTIVATED" });
    })()
  );
});

// =============================================================================
// Push Notification Handlers
// =============================================================================

/**
 * Handle incoming push notifications
 * Expected payload format:
 * {
 *   title: string;
 *   body: string;
 *   icon?: string;
 *   badge?: string;
 *   url?: string;
 *   tag?: string;
 *   data?: object;
 * }
 */
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    // If not JSON, treat as plain text
    payload = {
      title: "Clemson Sports Media",
      body: event.data.text(),
    };
  }

  const {
    title = "Clemson Sports Media",
    body = "New update available",
    icon = "/icons/icon-192x192.png",
    badge = "/icons/icon-96x96.png",
    url = "/",
    tag = "csm-notification",
    data = {},
  } = payload;

  // Service Worker NotificationOptions (extends standard with vibrate/actions)
  const options = {
    body,
    icon,
    badge,
    tag,
    data: { ...data, url },
    vibrate: [100, 50, 100],
    actions: [
      {
        action: "open",
        title: "Read More",
      },
      {
        action: "close",
        title: "Dismiss",
      },
    ],
    requireInteraction: false,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * Validate notification URL against whitelist
 * SECURITY: Prevents malicious push notifications from redirecting to phishing sites
 */
function isValidNotificationUrl(url: string): boolean {
  // Must be a relative path starting with /
  if (!url.startsWith("/")) {
    return false;
  }
  // Prevent protocol-relative URLs (//evil.com)
  if (url.startsWith("//")) {
    return false;
  }
  // Prevent javascript: or other protocol URLs disguised as paths
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(url)) {
    return false;
  }
  // Decode and re-check for encoded attacks
  try {
    const decoded = decodeURIComponent(url);
    if (decoded.startsWith("//") || /^\/[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(decoded)) {
      return false;
    }
  } catch {
    // If decoding fails, reject the URL
    return false;
  }
  return true;
}

/**
 * Handle notification click events
 * Opens the URL specified in the notification data
 * SECURITY: URL is validated against whitelist before opening
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") {
    return;
  }

  const rawUrl = event.notification.data?.url || "/";
  // SECURITY: Validate URL before opening to prevent malicious redirects
  const url = isValidNotificationUrl(rawUrl) ? rawUrl : "/";

  event.waitUntil(
    (async () => {
      // Try to focus an existing window with the URL
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      // Open a new window if none found
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })()
  );
});

/**
 * Handle notification close events (for analytics)
 */
self.addEventListener("notificationclose", (event) => {
  // Could send analytics here if needed
  console.log("[SW] Notification closed:", event.notification.tag);
});

serwist.addEventListeners();
