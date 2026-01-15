"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * PWA Loading Screen Component
 *
 * Displays a splash screen with the mobile screenshot when the PWA launches.
 * Shows a smooth fade-out animation once the app is fully loaded.
 * Only appears on PWA standalone mode or when explicitly triggered.
 */
export default function PWALoadScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    setIsPWA(isStandalone);

    // If not PWA, hide immediately
    if (!isStandalone) {
      setIsVisible(false);
      return;
    }

    // Wait for the page to be fully loaded
    const handleLoad = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoaded(true);
        // Remove from DOM after animation completes
        setTimeout(() => {
          setIsVisible(false);
        }, 600);
      }, 500);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // Don't render if not visible or not PWA
  if (!isVisible || !isPWA) {
    return null;
  }

  return (
    <div
      className={`pwa-load-screen ${isLoaded ? "pwa-load-screen--loaded" : ""}`}
      role="progressbar"
      aria-label="Loading application"
      aria-busy={!isLoaded}
    >
      <div className="pwa-load-screen__content">
        <Image
          src="/screenshots/mobile.png"
          alt="Loading..."
          fill
          priority
          className="pwa-load-screen__image"
          sizes="100vw"
        />
        <div className="pwa-load-screen__overlay">
          <div className="pwa-load-screen__spinner" aria-hidden="true">
            <svg
              className="pwa-load-screen__spinner-svg"
              viewBox="0 0 50 50"
            >
              <circle
                className="pwa-load-screen__spinner-circle"
                cx="25"
                cy="25"
                r="20"
                fill="none"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
