/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import {
  Serwist,
  CacheFirst,
  StaleWhileRevalidate,
  NetworkFirst,
  NetworkOnly,
  ExpirationPlugin,
  BackgroundSyncPlugin,
} from "serwist";

/**
 * Service Worker configuration for Serwist
 * Replaces @ducanh2912/next-pwa which is incompatible with Next.js 16 Turbopack
 *
 * Caching strategies:
 * - CacheFirst: For static assets that rarely change (fonts, images)
 * - StaleWhileRevalidate: For assets that may update (JS, CSS)
 * - NetworkFirst: For dynamic content (API calls)
 *
 * Build requirement:
 * - Must use `next build --webpack` flag since Serwist requires webpack plugins
 * - Development uses Turbopack for speed (SW disabled in dev)
 */

declare const self: ServiceWorkerGlobalScope & {
  __SW_MANIFEST: (string | { url: string; revision: string | null })[];
};

/**
 * Background Sync plugin for offline form submissions
 * Queues failed POST requests and retries when back online
 *
 * SECURITY: Retention time reduced from 24 hours to 4 hours
 * to minimize exposure of sensitive form data if device is compromised
 */
const contactFormSync = new BackgroundSyncPlugin("contact-form-queue", {
  maxRetentionTime: 4 * 60, // Retry for up to 4 hours (reduced from 24h for security)
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request.clone());
        // Notify the client that the form was successfully synced
        const clients = await self.clients.matchAll();
        for (const client of clients) {
          client.postMessage({
            type: "BACKGROUND_SYNC_SUCCESS",
            payload: { queue: "contact-form-queue" },
          });
        }
      } catch (error) {
        // Put the request back in the queue and re-throw to signal failure
        await queue.unshiftRequest(entry);
        throw error;
      }
    }
  },
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Contact form API - network only with background sync fallback
    // When offline, queues the request and syncs when back online
    {
      matcher: /\/api\/contact$/i,
      handler: new NetworkOnly({
        plugins: [contactFormSync],
      }),
      method: "POST",
    },
    // Google Fonts - cache first for performance (1 year)
    {
      matcher: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: "google-fonts",
        plugins: [
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
        cacheName: "static-fonts",
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
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-images",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    // Static assets (JS/CSS) - stale while revalidate (1 day)
    {
      matcher: /\.(?:js|css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: "static-assets",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },
    // WordPress API - network first with fallback (1 hour cache)
    {
      matcher: /^https:\/\/.*\.(?:wpstarter\.mysites\.io|websiteplayground\.local)\/wp-json\/.*/i,
      handler: new NetworkFirst({
        cacheName: "wordpress-api",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
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
        cacheName: "wordpress-uploads",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
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

serwist.addEventListeners();
