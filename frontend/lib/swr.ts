/**
 * SWR Data Fetching Hooks
 * Client-side caching with stale-while-revalidate pattern for instant page loads
 */
'use client';

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import {
  getPost,
  getService,
  getPosts,
  getServices,
  type WPPost,
  type WPService,
} from './wordpress';

// =============================================================================
// SWR Global Configuration
// =============================================================================

/**
 * Global SWR configuration for optimal caching behavior
 * - revalidateOnFocus: Refresh data when user returns to tab
 * - revalidateOnReconnect: Refresh data when network reconnects
 * - dedupingInterval: Prevent duplicate requests within 5 seconds
 * - errorRetryCount: Retry failed requests up to 3 times
 *
 * Note: No refreshInterval - we want on-demand revalidation, not polling.
 * Polling wastes bandwidth on mobile. SWR's stale-while-revalidate +
 * focus revalidation is sufficient for "real-time" feel.
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds - matches current ISR
  errorRetryCount: 3,
};

// =============================================================================
// Type Definitions
// =============================================================================

/**
 * Generic hook return type with loading and error states
 */
export interface UseDataResult<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: SWRResponse<T, Error>['mutate'];
}

/**
 * Parameters for list fetching hooks
 */
export interface ListParams {
  per_page?: number;
  page?: number;
}

// =============================================================================
// SWR Cache Keys
// =============================================================================

/**
 * Generate cache key for single post
 */
function postKey(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return `post:${slug}`;
}

/**
 * Generate cache key for single service
 */
function serviceKey(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return `service:${slug}`;
}

/**
 * Generate cache key for posts list
 */
function postsKey(params?: ListParams): string {
  const queryParts: string[] = ['posts'];
  if (params?.per_page) queryParts.push(`per_page:${params.per_page}`);
  if (params?.page) queryParts.push(`page:${params.page}`);
  return queryParts.join(':');
}

/**
 * Generate cache key for services list
 */
function servicesKey(params?: ListParams): string {
  const queryParts: string[] = ['services'];
  if (params?.per_page) queryParts.push(`per_page:${params.per_page}`);
  if (params?.page) queryParts.push(`page:${params.page}`);
  return queryParts.join(':');
}

// =============================================================================
// Data Fetching Hooks
// =============================================================================

/**
 * Fetch a single post by slug with SWR caching
 *
 * @param slug - The post slug to fetch
 * @returns Hook result with post data, error, loading state, and mutate function
 *
 * @example
 * ```tsx
 * const { data: post, isLoading } = usePost('my-post-slug');
 * ```
 */
export function usePost(slug: string | null | undefined): UseDataResult<WPPost | null> {
  const { data, error, isLoading, mutate } = useSWR<WPPost | null, Error>(
    postKey(slug),
    slug ? () => getPost(slug) : null,
    swrConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Fetch a single service by slug with SWR caching
 *
 * @param slug - The service slug to fetch
 * @returns Hook result with service data, error, loading state, and mutate function
 *
 * @example
 * ```tsx
 * const { data: service, isLoading } = useService('web-design');
 * ```
 */
export function useService(slug: string | null | undefined): UseDataResult<WPService | null> {
  const { data, error, isLoading, mutate } = useSWR<WPService | null, Error>(
    serviceKey(slug),
    slug ? () => getService(slug) : null,
    swrConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Fetch posts list with SWR caching
 *
 * @param params - Optional pagination parameters
 * @returns Hook result with posts array, error, loading state, and mutate function
 *
 * @example
 * ```tsx
 * const { data: posts, isLoading } = usePosts({ per_page: 10 });
 * ```
 */
export function usePosts(params?: ListParams): UseDataResult<WPPost[]> {
  const { data, error, isLoading, mutate } = useSWR<WPPost[], Error>(
    postsKey(params),
    () => getPosts(params),
    swrConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Fetch services list with SWR caching
 *
 * @param params - Optional pagination parameters
 * @returns Hook result with services array, error, loading state, and mutate function
 *
 * @example
 * ```tsx
 * const { data: services, isLoading } = useServices({ per_page: 6 });
 * ```
 */
export function useServices(params?: ListParams): UseDataResult<WPService[]> {
  const { data, error, isLoading, mutate } = useSWR<WPService[], Error>(
    servicesKey(params),
    () => getServices(params),
    swrConfig
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
