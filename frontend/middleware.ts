import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to handle:
 * 1. Root-level date-based post URLs (/{year}/{month}/{day}/{slug}) -> rewrite to internal /_posts route
 * 2. Redirects from old /blog/{year}/{month}/{slug} URLs to new /{year}/{month}/{day}/{slug} format
 * 3. Legacy /blog/[slug] URLs to new date-based format
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle root-level date pattern: /{year}/{month}/{day}/{slug}
  // Match /{4-digit-year}/{2-digit-month}/{2-digit-day}/{slug}
  const datePostMatch = pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^\/]+)$/);
  if (datePostMatch) {
    const [, year, month, day, slug] = datePostMatch;
    // Rewrite to internal _posts route (underscore prefix hides from public routing)
    return NextResponse.rewrite(new URL(`/_posts/${year}/${month}/${day}/${slug}`, request.url));
  }

  // 2. Redirect old /blog/{year}/{month}/{slug} URLs to new format
  // This handles the transition from /blog/2026/01/postname to /2026/01/DD/postname
  const oldDateUrlMatch = pathname.match(/^\/blog\/(\d{4})\/(\d{2})\/([^\/]+)$/);
  if (oldDateUrlMatch) {
    const [, year, month, slug] = oldDateUrlMatch;

    // Fetch post data from WordPress to get the day
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
      const postDay = String(postDate.getDate()).padStart(2, "0");

      // Redirect to new URL format with 308 (permanent redirect)
      const newUrl = new URL(`/${year}/${month}/${postDay}/${slug}`, request.url);
      return NextResponse.redirect(newUrl, 308);
    } catch {
      // On error, let the request continue (will likely 404)
      return NextResponse.next();
    }
  }

  // 3. Handle legacy /blog/[slug] patterns (slug without year/month)
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
      const day = String(postDate.getDate()).padStart(2, "0");

      // Redirect to new URL format with 308 (permanent redirect)
      const newUrl = new URL(`/${year}/${month}/${day}/${slug}`, request.url);
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
    /*
     * Match paths that could be date-based post URLs or old blog URLs.
     * Excludes Next.js internals, static files, and API routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|api|images|fonts).*)",
  ],
};
