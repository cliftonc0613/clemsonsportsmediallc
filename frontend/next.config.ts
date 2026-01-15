import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import withSerwistInit from "@serwist/next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const isDev = process.env.NODE_ENV === 'development';

/**
 * Serwist PWA configuration
 * Replaces @ducanh2912/next-pwa which is incompatible with Next.js 16 Turbopack
 *
 * Key differences from @ducanh2912/next-pwa:
 * - Uses a dedicated sw.ts file in app/ directory
 * - Works with webpack (required for service worker generation)
 * - Service worker is automatically registered
 *
 * Enhanced service worker features:
 * - App shell precaching for instant navigation
 * - Versioned caching for controlled updates
 * - Broadcast channel for UI notifications
 */
const withPWA = withSerwistInit({
  swSrc: "app/sw.enhanced.ts",
  swDest: "public/sw.js",
  disable: isDev,
  reloadOnOnline: true,
});

// Check if we're using a local WordPress (resolves to loopback IP)
// Next.js 14+ blocks image optimization for private IPs (SSRF protection)
const isLocalWordPress = process.env.WORDPRESS_API_URL?.includes('.local') ?? false;

const nextConfig: NextConfig = {
  // Fix workspace root detection - prevents Next.js from using ~/package-lock.json
  outputFileTracingRoot: __dirname,

  images: {
    // Disable optimization only in development or when using local WordPress
    // In production with public WordPress domain, images will be optimized
    // Note: Next.js 14+ blocks image optimization for private IPs (SSRF protection)
    unoptimized: isDev || isLocalWordPress,
    remotePatterns: [
      // Local WordPress domain
      {
        protocol: 'http',
        hostname: 'wp.clemsonsportsmediacom.local',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'wp.clemsonsportsmediacom.local',
        pathname: '/wp-content/uploads/**',
      },
      // Production WordPress domain (uncomment when deploying)
      // {
      //   protocol: 'https',
      //   hostname: 'wpstarter.mysites.io',
      //   pathname: '/wp-content/uploads/**',
      // },
    ],
  },

  // Environment variables that should be available on the client
  env: {
    WORDPRESS_API_URL: process.env.WORDPRESS_API_URL,
  },
};

// Wrap with Sentry configuration
// Sentry configuration options: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const sentryConfig = withSentryConfig(withBundleAnalyzer(withPWA(nextConfig)), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/nextjs#options

  // Only upload source maps if auth token is provided
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppresses source map upload logs during build (silent when no auth token)
  silent: true,

  // Disable telemetry collection
  telemetry: false,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Source maps configuration
  sourcemaps: {
    // Delete source maps after upload (don't expose to client)
    deleteSourcemapsAfterUpload: true,
  },

  // Disable tunneling (use direct Sentry connection)
  tunnelRoute: undefined,
});

export default sentryConfig;
