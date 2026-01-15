'use client';

import { useState, useEffect } from 'react';

interface BackgroundSyncMessage {
  type: 'BACKGROUND_SYNC_SUCCESS';
  payload: {
    queue: string;
  };
}

/**
 * Hook for tracking online/offline status and background sync events
 *
 * Features:
 * - Real-time online/offline detection
 * - Service Worker message handling for background sync
 * - Callback for sync success notifications
 */
export function useOnlineStatus(onSyncSuccess?: (queue: string) => void) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Event handlers
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Service Worker message handler for background sync
    const handleMessage = (event: MessageEvent<BackgroundSyncMessage>) => {
      if (event.data?.type === 'BACKGROUND_SYNC_SUCCESS') {
        onSyncSuccess?.(event.data.payload.queue);
      }
    };

    // Register event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [onSyncSuccess]);

  return isOnline;
}

/**
 * Check if Background Sync API is supported
 */
export function isBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
}
