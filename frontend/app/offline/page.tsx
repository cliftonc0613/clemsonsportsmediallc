"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 rounded-full bg-muted p-6">
        <WifiOff className="h-16 w-16 text-muted-foreground" />
      </div>

      <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight md:text-5xl">
        You&apos;re Offline
      </h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        It looks like you&apos;ve lost your internet connection. Some content may not be available
        until you&apos;re back online.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleRetry}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold">While you wait...</h2>
        <ul className="space-y-2 text-left text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            Check your Wi-Fi or mobile data connection
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            Try moving to an area with better signal
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            Previously viewed pages may still be available
          </li>
        </ul>
      </div>
    </div>
  );
}
