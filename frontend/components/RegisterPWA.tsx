"use client";

import { useEffect } from "react";

/**
 * PWA Registration Component
 *
 * Manually registers the service worker when the app loads.
 * Falls back to direct registration if window.serwist doesn't exist.
 * Only runs in production builds (SW disabled in development).
 *
 * Usage: Import in root layout.tsx
 */
export default function RegisterPWA() {
  useEffect(() => {
    // In development, unregister any existing service workers
    if (process.env.NODE_ENV !== "production") {
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
      return;
    }

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Try Serwist auto-registration first
      if (window.serwist !== undefined) {
        window.serwist.register();
      } else {
        // Fallback: manual registration
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration.scope);
          })
          .catch((error) => {
            console.error("Service Worker registration failed:", error);
          });
      }
    }
  }, []);

  return null;
}
