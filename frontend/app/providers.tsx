'use client';

import { SWRConfig } from 'swr';
import { ThemeProvider } from 'next-themes';
import { swrConfig } from '@/lib/swr';
import { WebVitals } from '@/components/WebVitals';
import { ViewTransitions } from '@/components/ViewTransitions';
import { LoadingProvider, LoadingOverlay } from '@/components/LoadingProvider';

/**
 * Global providers wrapper for the application
 *
 * Wraps the app with:
 * - ThemeProvider: Dark/light mode support with system preference detection
 * - SWRConfig: Client-side data caching with stale-while-revalidate pattern
 * - WebVitals: Core Web Vitals monitoring and reporting
 * - ViewTransitions: Smooth page transitions using View Transitions API
 * - LoadingProvider: Global loading state management
 *
 * This enables instant page loads by serving cached data immediately
 * while revalidating in the background for fresh content.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SWRConfig value={swrConfig}>
        <LoadingProvider>
          <WebVitals />
          <ViewTransitions />
          {children}
          <LoadingOverlay />
        </LoadingProvider>
      </SWRConfig>
    </ThemeProvider>
  );
}
