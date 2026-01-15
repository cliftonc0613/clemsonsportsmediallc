"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-white to-gray-50">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/images/clemson-sports-media-horz-orgpur-logo@3x.png"
          alt="Clemson Sports Media"
          width={240}
          height={52}
          className="h-12 w-auto opacity-80"
        />
      </div>

      {/* Icon with Clemson styling */}
      <div className="mb-8 rounded-full bg-[var(--clemson-orange)]/10 p-6 ring-4 ring-[var(--clemson-orange)]/20">
        <WifiOff className="h-16 w-16 text-[var(--clemson-orange)]" />
      </div>

      <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-[var(--clemson-dark-purple)] md:text-5xl">
        You&apos;re Offline
      </h1>

      <p className="mb-8 max-w-md text-lg text-gray-600">
        It looks like you&apos;ve lost your internet connection. Don&apos;t
        worry - some content may still be available from your cache.
      </p>

      {/* Action buttons with Clemson styling */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <button
          onClick={handleRetry}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--clemson-orange)] px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider text-white transition-colors hover:bg-[var(--clemson-purple)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clemson-orange)]"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-[var(--clemson-dark-purple)] bg-white px-6 py-3 text-sm font-heading font-bold uppercase tracking-wider text-[var(--clemson-dark-purple)] transition-colors hover:bg-[var(--clemson-dark-purple)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--clemson-dark-purple)]"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>

      {/* Tips section with Clemson accent */}
      <div className="mt-12 max-w-md rounded-lg border-l-4 border-[var(--clemson-orange)] bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-heading font-bold text-[var(--clemson-dark-purple)]">
          While you wait...
        </h2>
        <ul className="space-y-2 text-left text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--clemson-orange)]" />
            Check your Wi-Fi or mobile data connection
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--clemson-orange)]" />
            Try moving to an area with better signal
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--clemson-orange)]" />
            Previously viewed articles may still be accessible
          </li>
        </ul>
      </div>

      {/* Footer accent */}
      <div className="mt-12 h-1 w-24 rounded-full bg-gradient-to-r from-[var(--clemson-orange)] to-[var(--clemson-purple)]" />
    </div>
  );
}
