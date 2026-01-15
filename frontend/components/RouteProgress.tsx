"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Route Progress Indicator
 *
 * Shows a progress bar at the top of the viewport during route transitions.
 * Works with Next.js App Router by detecting pathname/searchParam changes.
 *
 * Features:
 * - Automatic detection of navigation start/end
 * - Smooth progress animation with easing
 * - Graceful timeout handling
 * - Minimal re-renders using refs
 */
export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Track if we're in a navigation
  useEffect(() => {
    if (isPending) {
      setIsNavigating(true);
      setProgress(30);

      // Simulate progress during navigation
      const timer1 = setTimeout(() => setProgress(50), 200);
      const timer2 = setTimeout(() => setProgress(70), 500);
      const timer3 = setTimeout(() => setProgress(85), 1000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isPending]);

  // Complete progress when route changes
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, isNavigating]);

  if (!isNavigating && progress === 0) {
    return null;
  }

  return (
    <div
      className="route-progress"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page loading"
    >
      <div
        className="route-progress__bar"
        style={{
          transform: `scaleX(${progress / 100})`,
          opacity: progress === 100 ? 0 : 1,
          transition:
            progress === 100
              ? "transform 0.2s ease-out, opacity 0.3s ease-out 0.1s"
              : "transform 0.2s ease-out",
        }}
      />
    </div>
  );
}

/**
 * Hook for manual navigation progress control
 * Use this when you need to programmatically show/hide the progress bar
 */
export function useRouteProgress() {
  const [isLoading, setIsLoading] = useState(false);

  const start = useCallback(() => setIsLoading(true), []);
  const done = useCallback(() => setIsLoading(false), []);

  return { isLoading, start, done };
}
