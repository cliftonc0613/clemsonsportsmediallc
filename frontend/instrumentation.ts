/**
 * Next.js Instrumentation
 *
 * This file runs when the Next.js server starts.
 * - Configures Node.js DNS resolution to prefer IPv4 (Local by Flywheel fix)
 * - Initializes Sentry error tracking for server/edge runtimes
 */

import * as Sentry from '@sentry/nextjs'

export async function register() {
  // Server runtime setup
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Force IPv4 first for DNS resolution
    // This fixes Local by Flywheel .local domain resolution
    const dns = await import('dns')
    dns.setDefaultResultOrder('ipv4first')

    // Initialize Sentry for server
    await import('./sentry.server.config')
  }

  // Edge runtime setup
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Capture errors from Server Components
export const onRequestError = Sentry.captureRequestError
