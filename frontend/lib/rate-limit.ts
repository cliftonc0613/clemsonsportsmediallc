/**
 * Rate Limiting Utility
 *
 * Simple in-memory rate limiter for API routes.
 * For production, consider using Upstash Redis or Vercel Edge Config.
 *
 * @example
 * ```ts
 * const limiter = new RateLimiter({ interval: 60000, limit: 5 });
 *
 * export async function POST(request: NextRequest) {
 *   const ip = getClientIp(request);
 *   const { success, remaining, reset } = limiter.check(ip);
 *
 *   if (!success) {
 *     return NextResponse.json(
 *       { error: "Too many requests" },
 *       { status: 429, headers: { "Retry-After": String(reset) } }
 *     );
 *   }
 *   // ... handle request
 * }
 * ```
 */

import { NextRequest } from "next/server";

interface RateLimitOptions {
  /** Time window in milliseconds */
  interval: number;
  /** Maximum requests per interval */
  limit: number;
}

interface RateLimitResult {
  /** Whether the request is allowed */
  success: boolean;
  /** Remaining requests in current window */
  remaining: number;
  /** Seconds until rate limit resets */
  reset: number;
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

/**
 * In-memory rate limiter using token bucket algorithm
 *
 * Note: This is suitable for single-server deployments.
 * For multi-server deployments, use Redis-based rate limiting.
 */
export class RateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();
  private readonly interval: number;
  private readonly limit: number;

  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.limit = options.limit;

    // Clean up old entries periodically (every 5 minutes)
    if (typeof setInterval !== "undefined") {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }
  }

  /**
   * Check if a request should be allowed
   */
  check(identifier: string): RateLimitResult {
    const now = Date.now();
    let bucket = this.buckets.get(identifier);

    if (!bucket) {
      // New client - initialize with full tokens
      bucket = { tokens: this.limit - 1, lastRefill: now };
      this.buckets.set(identifier, bucket);
      return { success: true, remaining: this.limit - 1, reset: Math.ceil(this.interval / 1000) };
    }

    // Calculate tokens to add based on time elapsed
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor((elapsed / this.interval) * this.limit);

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.limit, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }

    // Calculate reset time
    const resetMs = this.interval - (now - bucket.lastRefill);
    const reset = Math.ceil(resetMs / 1000);

    if (bucket.tokens <= 0) {
      // Rate limited
      return { success: false, remaining: 0, reset };
    }

    // Consume a token
    bucket.tokens--;
    return { success: true, remaining: bucket.tokens, reset };
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = this.interval * 2;

    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key);
      }
    }
  }
}

/**
 * Extract client IP from request headers
 *
 * Handles common proxy headers used by Vercel, Cloudflare, etc.
 */
export function getClientIp(request: NextRequest): string {
  // Vercel
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP (original client)
    return forwardedFor.split(",")[0].trim();
  }

  // Cloudflare
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Real IP header
  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default (shouldn't happen in production)
  return "unknown";
}

/**
 * Pre-configured rate limiter for contact forms
 * 5 submissions per minute per IP
 */
export const contactFormLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  limit: 5,
});
