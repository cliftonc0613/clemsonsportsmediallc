import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { getPost } from "@/lib/wordpress";

/**
 * WordPress Preview Handler
 *
 * This endpoint enables Next.js Draft Mode for previewing
 * unpublished WordPress content.
 *
 * Called from WordPress when user clicks "Preview" button.
 *
 * Query params:
 * - secret: Preview secret for authentication
 * - slug: The post/page slug to preview
 * - id: The WordPress post ID
 * - type: The post type (post, page, services, testimonials)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const id = searchParams.get("id");
  const type = searchParams.get("type") || "post";

  // Validate secret
  const expectedSecret = process.env.PREVIEW_SECRET;
  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: "Invalid preview secret" },
      { status: 401 }
    );
  }

  // Validate slug
  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 }
    );
  }

  // Enable Draft Mode
  const draft = await draftMode();
  draft.enable();

  // Determine the redirect path based on post type
  let redirectPath: string;

  if (type === "post") {
    // For posts, fetch the post to get its date for the URL
    try {
      const post = await getPost(slug);
      if (post) {
        const postDate = new Date(post.date);
        const year = postDate.getFullYear();
        const month = String(postDate.getMonth() + 1).padStart(2, "0");
        redirectPath = `/blog/${year}/${month}/${slug}`;
      } else {
        // Fallback if post not found - use current date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        redirectPath = `/blog/${year}/${month}/${slug}`;
      }
    } catch {
      // Fallback on error - use current date
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      redirectPath = `/blog/${year}/${month}/${slug}`;
    }
  } else {
    const pathMap: Record<string, string> = {
      page: `/${slug}`,
      services: `/services/${slug}`,
      testimonials: `/testimonials`,
    };
    redirectPath = pathMap[type] || `/${slug}`;
  }

  // Redirect to the preview page
  // Include query params so the page knows it's in preview mode
  const redirectUrl = new URL(redirectPath, request.nextUrl.origin);
  redirectUrl.searchParams.set("preview", "true");
  if (id) {
    redirectUrl.searchParams.set("id", id);
  }

  return NextResponse.redirect(redirectUrl);
}
