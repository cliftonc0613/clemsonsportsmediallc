import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

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
  const pathMap: Record<string, string> = {
    post: `/blog/${slug}`,
    page: `/${slug}`,
    services: `/services/${slug}`,
    testimonials: `/testimonials`,
  };

  const redirectPath = pathMap[type] || `/${slug}`;

  // Redirect to the preview page
  // Include query params so the page knows it's in preview mode
  const redirectUrl = new URL(redirectPath, request.nextUrl.origin);
  redirectUrl.searchParams.set("preview", "true");
  if (id) {
    redirectUrl.searchParams.set("id", id);
  }

  return NextResponse.redirect(redirectUrl);
}
