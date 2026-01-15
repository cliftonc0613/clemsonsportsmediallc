'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

/**
 * Global Error Boundary
 *
 * Catches errors in the root layout and above.
 * This is the last resort error handler for the entire application.
 *
 * Note: This must render its own <html> and <body> tags since
 * it replaces the entire root layout on error.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to Sentry with error context
    Sentry.captureException(error, {
      tags: {
        errorBoundary: 'global',
      },
      extra: {
        digest: error.digest,
      },
    })
  }, [error])

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-destructive"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-muted-foreground mb-6">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            {/* Error Digest for Support */}
            {error.digest && (
              <p className="text-xs text-muted-foreground mb-6 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => reset()}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
              <a
                href="/"
                className="block w-full px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Go to homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
