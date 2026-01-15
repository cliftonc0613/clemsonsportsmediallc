/**
 * Web Vitals Monitoring
 * Captures Core Web Vitals metrics and reports them to analytics
 *
 * Metrics tracked:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * - FCP (First Contentful Paint): Initial render
 * - TTFB (Time to First Byte): Server response
 * - INP (Interaction to Next Paint): Responsiveness
 */

import type { Metric } from 'web-vitals';

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals';

/**
 * Get the connection speed for analytics context
 */
function getConnectionSpeed(): string {
  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
    };
  };
  return nav.connection?.effectiveType ?? '';
}

/**
 * Send Web Vitals to Vercel Analytics (or custom endpoint)
 */
export function sendToAnalytics(metric: Metric): void {
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID;

  // Log to console in development for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, Math.round(metric.value), 'ms');
    return;
  }

  // If no analytics ID configured, just log and return
  if (!analyticsId) {
    console.debug('[Web Vitals]', metric.name, Math.round(metric.value));
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  // Use sendBeacon for reliability (doesn't block unload)
  const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
  if (navigator.sendBeacon) {
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    fetch(vitalsUrl, {
      body: JSON.stringify(body),
      method: 'POST',
      keepalive: true,
    });
  }
}

/**
 * Report handler that categorizes metrics by quality
 * Good/Needs Improvement/Poor thresholds based on Google's recommendations
 */
export function reportVitals(metric: Metric): void {
  // Categorize the metric
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
    INP: [200, 500],
  };

  const [good, poor] = thresholds[metric.name] ?? [0, 0];
  const rating = metric.value <= good ? 'good' : metric.value <= poor ? 'needs-improvement' : 'poor';

  // Log with color coding in development
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      good: '\x1b[32m', // green
      'needs-improvement': '\x1b[33m', // yellow
      poor: '\x1b[31m', // red
    };
    const reset = '\x1b[0m';
    console.log(
      `${colors[rating]}[${metric.name}]${reset} ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`
    );
  }

  // Send to analytics
  sendToAnalytics(metric);
}
