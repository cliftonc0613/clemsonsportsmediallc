import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { revalidateLimiter, getClientIp } from "@/lib/rate-limit";

/**
 * On-demand ISR Revalidation API
 *
 * This endpoint allows WordPress to trigger cache revalidation
 * when content is published or updated.
 *
 * SECURITY: POST-only endpoint. Secrets in URL query parameters (GET)
 * are logged in server access logs and can leak via referrer headers.
 *
 * SECURITY: Rate limited to prevent brute-force secret guessing.
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "secret": "your-secret", "path": "/blog/my-post" }
 *
 * Or with type/slug (triggered by WordPress save_post hook):
 * Body: { "secret": "your-secret", "type": "post", "slug": "my-post" }
 */

// SECURITY: Valid slug pattern - alphanumeric, hyphens, underscores only
const VALID_SLUG_PATTERN = /^[a-z0-9_-]+$/i;

export async function POST(request: NextRequest) {
  // SECURITY: Rate limiting to prevent brute-force secret guessing
  const clientIp = getClientIp(request);
  const { success, reset } = revalidateLimiter.check(clientIp);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(reset) },
      }
    );
  }

  try {
    const body = await request.json();
    const { secret, path, type, slug } = body;

    // Validate secret
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // SECURITY: Validate slug format to prevent path injection
    if (slug && !VALID_SLUG_PATTERN.test(slug)) {
      return NextResponse.json(
        { error: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Handle path-based revalidation
    if (path) {
      revalidatePath(path);
      return NextResponse.json({
        success: true,
        message: `Revalidated path: ${path}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Handle WordPress post type + slug revalidation
    if (type && slug) {
      const pathMap: Record<string, string> = {
        post: `/blog/${slug}`,
        page: `/${slug}`,
        services: `/services/${slug}`,
        testimonials: `/testimonials`,
      };

      const pathToRevalidate = pathMap[type];
      if (pathToRevalidate) {
        revalidatePath(pathToRevalidate);

        // Also revalidate listing pages
        if (type === "post") {
          revalidatePath("/blog");
          revalidatePath("/"); // Home page shows latest posts
        } else if (type === "services") {
          revalidatePath("/services");
          revalidatePath("/"); // Home page shows services
        } else if (type === "testimonials") {
          revalidatePath("/"); // Home page shows testimonials
        }

        return NextResponse.json({
          success: true,
          message: `Revalidated ${type}: ${slug}`,
          paths: [pathToRevalidate],
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json(
      { error: "Missing path or type/slug parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
