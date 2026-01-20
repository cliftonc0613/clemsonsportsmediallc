"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface LoadingStage {
  name: string;
  weight: number;
  complete: boolean;
}

/**
 * Enhanced PWA Loading Screen with Progress Tracking
 *
 * Improvements over original:
 * - Real progress tracking across multiple loading stages
 * - Perceived performance optimization (fast initial progress)
 * - Font loading detection
 * - Critical resource prefetch completion tracking
 * - Graceful timeout fallback
 * - Better state management with refs for cleanup
 * - Only shows on mobile devices
 */
export default function PWALoadScreenEnhanced() {
  // Start with null to avoid hydration mismatch, then determine display status
  const [shouldShow, setShouldShow] = useState<boolean | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Initializing...");
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loading stages with weighted progress contribution
  const [stages, setStages] = useState<LoadingStage[]>([
    { name: "DOM Ready", weight: 20, complete: false },
    { name: "Fonts Loaded", weight: 25, complete: false },
    { name: "Images Loaded", weight: 25, complete: false },
    { name: "App Ready", weight: 30, complete: false },
  ]);

  const completeStage = useCallback((stageName: string) => {
    if (!mountedRef.current) return;

    setStages((prev) => {
      const updated = prev.map((stage) =>
        stage.name === stageName ? { ...stage, complete: true } : stage
      );

      // Calculate new progress
      const newProgress = updated.reduce(
        (acc, stage) => acc + (stage.complete ? stage.weight : 0),
        0
      );
      setProgress(newProgress);

      return updated;
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    // Check if on mobile device (user agent only, not viewport width)
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    // Check if running as installed PWA (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      document.referrer.includes("android-app://");

    const shouldDisplay = isMobile && isStandalone;
    setShouldShow(shouldDisplay);

    if (!shouldDisplay) {
      setIsVisible(false);
      return;
    }

    // Stage 1: DOM Ready
    if (document.readyState === "interactive" || document.readyState === "complete") {
      completeStage("DOM Ready");
      setLoadingText("Loading resources...");
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        completeStage("DOM Ready");
        setLoadingText("Loading resources...");
      });
    }

    // Stage 2: Fonts Loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (mountedRef.current) {
          completeStage("Fonts Loaded");
          setLoadingText("Loading images...");
        }
      });
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => completeStage("Fonts Loaded"), 500);
    }

    // Stage 3: Critical images loaded
    const checkImages = () => {
      const criticalImages = document.querySelectorAll('img[loading="eager"], img[fetchpriority="high"]');
      if (criticalImages.length === 0) {
        completeStage("Images Loaded");
        setLoadingText("Preparing app...");
        return;
      }

      let loadedCount = 0;
      criticalImages.forEach((img) => {
        if ((img as HTMLImageElement).complete) {
          loadedCount++;
        }
      });

      if (loadedCount === criticalImages.length) {
        completeStage("Images Loaded");
        setLoadingText("Preparing app...");
      }
    };

    // Stage 4: Full page load
    const handleFullLoad = () => {
      if (!mountedRef.current) return;

      checkImages();

      // Small delay for smooth transition
      setTimeout(() => {
        if (mountedRef.current) {
          completeStage("App Ready");
          setLoadingText("Ready!");

          // Fade out sequence
          setTimeout(() => {
            if (mountedRef.current) {
              setIsLoaded(true);
              setTimeout(() => {
                if (mountedRef.current) {
                  setIsVisible(false);
                }
              }, 600);
            }
          }, 200);
        }
      }, 300);
    };

    if (document.readyState === "complete") {
      handleFullLoad();
    } else {
      window.addEventListener("load", handleFullLoad);
    }

    // Failsafe timeout - ensure loading screen doesn't block indefinitely
    timeoutRef.current = setTimeout(() => {
      if (mountedRef.current && !isLoaded) {
        console.warn("PWA Load Screen: Timeout reached, forcing completion");
        setProgress(100);
        setIsLoaded(true);
        setTimeout(() => setIsVisible(false), 600);
      }
    }, 8000);

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener("load", handleFullLoad);
    };
  }, [completeStage, isLoaded]);

  // Hide if: explicitly not a mobile PWA, or loading is complete
  // Show if: shouldShow is null (checking) or true (confirmed mobile PWA) AND still visible
  if (shouldShow === false || !isVisible) {
    return null;
  }

  return (
    <div
      className={`pwa-load-screen ${isLoaded ? "pwa-load-screen--loaded" : ""}`}
      role="progressbar"
      aria-label="Loading application"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-busy={!isLoaded}
    >
      <div className="pwa-load-screen__content">
        <Image
          src="/screenshots/clemson-loading-screen.jpg"
          alt="Clemson Sports Media"
          fill
          priority
          className="pwa-load-screen__image"
          sizes="100vw"
        />
        <div className="pwa-load-screen__overlay">
          {/* Progress bar */}
          <div className="pwa-load-screen__progress-container">
            <div
              className="pwa-load-screen__progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Loading text */}
          <p className="pwa-load-screen__text" aria-live="polite">
            {loadingText}
          </p>

          {/* Spinner */}
          <div className="pwa-load-screen__spinner" aria-hidden="true">
            <svg className="pwa-load-screen__spinner-svg" viewBox="0 0 50 50">
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
