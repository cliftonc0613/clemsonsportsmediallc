'use client';

import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';
import { reportVitals } from '@/lib/web-vitals';

/**
 * WebVitals Component
 *
 * Initializes Core Web Vitals monitoring on the client side.
 * Metrics are reported to analytics and logged in development.
 *
 * Metrics tracked:
 * - LCP: Largest Contentful Paint (loading)
 * - FID: First Input Delay (interactivity) - deprecated, using INP
 * - INP: Interaction to Next Paint (responsiveness)
 * - CLS: Cumulative Layout Shift (visual stability)
 * - FCP: First Contentful Paint (initial render)
 * - TTFB: Time to First Byte (server response)
 */
export function WebVitals() {
  useEffect(() => {
    // Register all Core Web Vitals observers
    onCLS(reportVitals);
    onFCP(reportVitals);
    onINP(reportVitals);
    onLCP(reportVitals);
    onTTFB(reportVitals);
  }, []);

  return null;
}
