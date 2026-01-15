'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * View Transitions Component
 *
 * Enables smooth page transitions using the View Transitions API.
 * Falls back gracefully on unsupported browsers.
 *
 * Browser support (as of 2024):
 * - Chrome 111+
 * - Edge 111+
 * - Safari 18+ (partial)
 * - Firefox: Not yet supported
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */
export function ViewTransitions() {
  const pathname = usePathname();

  useEffect(() => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      return;
    }

    // Add view-transition class to enable CSS transitions
    document.documentElement.classList.add('view-transitions-enabled');

    return () => {
      document.documentElement.classList.remove('view-transitions-enabled');
    };
  }, []);

  // Log transitions in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[ViewTransitions] Navigated to:', pathname);
    }
  }, [pathname]);

  return null;
}

/**
 * Utility to trigger a view transition programmatically
 * Use this when you need to animate non-navigation changes
 */
export async function startViewTransition(callback: () => void | Promise<void>) {
  if (!document.startViewTransition) {
    await callback();
    return;
  }

  const transition = document.startViewTransition(async () => {
    await callback();
  });

  await transition.finished;
}
