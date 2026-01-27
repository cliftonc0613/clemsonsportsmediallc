import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle redirects from old /blog/[slug] URLs to new date-based URLs
 *
 * Old format: /blog/my-post-slug
 * New format: /blog/2025/01/my-post-slug
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle /blog/[slug] patterns (not /blog/[year]/[month]/[slug])
  // Match /blog/something where "something" is NOT a 4-digit year
  const oldBlogUrlMatch = pathname.match(/^\/blog\/([^\/]+)$/);
  if (oldBlogUrlMatch) {
    const slug = oldBlogUrlMatch[1];

    // Skip if slug looks like a year (4 digits)
    if (/^\d{4}$/.test(slug)) {
      return NextResponse.next();
    }

    // Fetch post data from WordPress to get the date
    const wpApiUrl = process.env.WORDPRESS_API_URL;
    if (!wpApiUrl) {
      return NextResponse.next();
    }

    try {
      const response = await fetch(
        `${wpApiUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_fields=date,slug`,
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );

      if (!response.ok) {
        return NextResponse.next();
      }

      const posts = await response.json();
      if (posts.length === 0) {
        return NextResponse.next();
      }

      const post = posts[0];
      const postDate = new Date(post.date);
      const year = postDate.getFullYear();
      const month = String(postDate.getMonth() + 1).padStart(2, "0");

      // Redirect to new URL format with 308 (permanent redirect)
      const newUrl = new URL(`/blog/${year}/${month}/${slug}`, request.url);
      return NextResponse.redirect(newUrl, 308);
    } catch {
      // On error, let the request continue (will likely 404)
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match /blog/[slug] but not /blog or /blog/[year]/[month]/[slug]
    "/blog/:slug",
  ],
};
