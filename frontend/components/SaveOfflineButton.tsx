'use client';

import { useState, useEffect } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SaveOfflineButtonProps {
  /** URL of the page to save */
  url: string;
  /** Title for the saved page */
  title: string;
  /** Optional class name */
  className?: string;
}

// Cache name for offline saved articles
const OFFLINE_CACHE_NAME = 'offline-articles';

// Storage key for saved articles metadata
const SAVED_ARTICLES_KEY = 'saved-offline-articles';

interface SavedArticle {
  url: string;
  title: string;
  savedAt: string;
}

/**
 * Save Offline Button Component
 *
 * Allows users to save articles for offline reading using the Cache API.
 * Saved articles persist across sessions and can be read without internet.
 *
 * Features:
 * - Cache API for storing page HTML
 * - localStorage for metadata persistence
 * - Visual feedback for saved state
 * - Remove from offline option
 */
export function SaveOfflineButton({ url, title, className }: SaveOfflineButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check if already saved on mount
  useEffect(() => {
    // Check if Cache API is supported
    if (!('caches' in window)) {
      setIsSupported(false);
      return;
    }

    checkIfSaved();
  }, [url]);

  const checkIfSaved = async () => {
    try {
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      const response = await cache.match(url);
      setIsSaved(!!response);
    } catch {
      setIsSaved(false);
    }
  };

  const saveForOffline = async () => {
    if (!isSupported) {
      toast.error('Offline saving not supported', {
        description: 'Your browser does not support offline saving.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Fetch the page
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch page');

      // Clone the response for caching
      const responseClone = response.clone();

      // Open the cache and store the response
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      await cache.put(url, responseClone);

      // Save metadata to localStorage
      const savedArticles = getSavedArticles();
      const newArticle: SavedArticle = {
        url,
        title,
        savedAt: new Date().toISOString(),
      };

      // Update or add the article
      const existingIndex = savedArticles.findIndex((a) => a.url === url);
      if (existingIndex >= 0) {
        savedArticles[existingIndex] = newArticle;
      } else {
        savedArticles.push(newArticle);
      }

      localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedArticles));

      setIsSaved(true);
      toast.success('Saved for offline reading', {
        description: 'This article is now available offline.',
      });
    } catch (error) {
      console.error('Failed to save for offline:', error);
      toast.error('Failed to save', {
        description: 'Could not save this article for offline reading.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromOffline = async () => {
    setIsLoading(true);

    try {
      // Remove from cache
      const cache = await caches.open(OFFLINE_CACHE_NAME);
      await cache.delete(url);

      // Remove from localStorage
      const savedArticles = getSavedArticles().filter((a) => a.url !== url);
      localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedArticles));

      setIsSaved(false);
      toast.success('Removed from offline', {
        description: 'This article is no longer saved offline.',
      });
    } catch (error) {
      console.error('Failed to remove from offline:', error);
      toast.error('Failed to remove', {
        description: 'Could not remove this article from offline storage.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if Cache API isn't supported
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={isSaved ? removeFromOffline : saveForOffline}
      disabled={isLoading}
      className={`gap-2 ${className}`}
      aria-label={isSaved ? 'Remove from offline' : 'Save for offline reading'}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          Saved
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Save Offline
        </>
      )}
    </Button>
  );
}

/**
 * Get list of saved articles from localStorage
 */
export function getSavedArticles(): SavedArticle[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(SAVED_ARTICLES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/**
 * Hook to get saved articles with reactivity
 */
export function useSavedArticles() {
  const [articles, setArticles] = useState<SavedArticle[]>([]);

  useEffect(() => {
    setArticles(getSavedArticles());

    // Listen for storage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SAVED_ARTICLES_KEY) {
        setArticles(getSavedArticles());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return articles;
}

/**
 * Compact icon-only variant
 */
export function SaveOfflineIconButton({ url, title, className }: SaveOfflineButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if Cache API is supported (SSR-safe)
    if (!('caches' in window)) {
      setIsSupported(false);
      return;
    }

    const check = async () => {
      try {
        const cache = await caches.open(OFFLINE_CACHE_NAME);
        const response = await cache.match(url);
        setIsSaved(!!response);
      } catch {
        setIsSaved(false);
      }
    };
    check();
  }, [url]);

  const handleClick = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    try {
      const cache = await caches.open(OFFLINE_CACHE_NAME);

      if (isSaved) {
        await cache.delete(url);
        const savedArticles = getSavedArticles().filter((a) => a.url !== url);
        localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedArticles));
        setIsSaved(false);
        toast.success('Removed from offline');
      } else {
        const response = await fetch(url);
        await cache.put(url, response.clone());
        const savedArticles = getSavedArticles();
        savedArticles.push({ url, title, savedAt: new Date().toISOString() });
        localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedArticles));
        setIsSaved(true);
        toast.success('Saved for offline');
      }
    } catch {
      toast.error('Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if Cache API isn't supported
  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      aria-label={isSaved ? 'Remove from offline' : 'Save for offline'}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isSaved ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <Download className="h-5 w-5" />
      )}
    </Button>
  );
}
