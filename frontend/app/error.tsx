'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import Link from 'next/link'

/**
 * Route Segment Error Boundary
 *
 * Catches errors within route segments (pages, layouts).
 * Renders within the existing layout structure.
 */
export default function Error({
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
        errorBoundary: 'route',
      },
      extra: {
        digest: error.digest,
      },
    })
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong</h1>
        <p className="text-muted-foreground mb-6">
          We encountered an error while loading this page. Please try again.
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
          <Link
            href="/"
            className="block w-full px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
