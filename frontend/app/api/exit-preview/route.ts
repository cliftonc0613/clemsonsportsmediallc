import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";

/**
 * Exit Preview Mode
 *
 * Disables Next.js Draft Mode and redirects back to the page.
 *
 * Query params:
 * - redirect: Path to redirect to after exiting preview (default: /)
 *
 * SECURITY: Validates redirect path to prevent open redirect attacks.
 */

/**
 * Validate redirect path to prevent open redirect attacks
 * Only allows relative paths that start with /
 */
function isValidRedirectPath(path: string): boolean {
  // Must start with /
  if (!path.startsWith("/")) {
    return false;
  }

  // Reject protocol-relative URLs (//example.com)
  if (path.startsWith("//")) {
    return false;
  }

  // Reject paths with protocol handlers (javascript:, data:, etc.)
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) {
    return false;
  }

  // Reject paths with encoded characters that could bypass validation
  // Decoding and re-checking helps prevent double-encoding attacks
  try {
    const decoded = decodeURIComponent(path);
    if (decoded.startsWith("//") || /^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded)) {
      return false;
    }
  } catch {
    // If decoding fails, reject the path
    return false;
  }

  return true;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let redirectPath = searchParams.get("redirect") || "/";

  // Validate redirect path to prevent open redirect
  if (!isValidRedirectPath(redirectPath)) {
    console.warn(`Invalid redirect path rejected: ${redirectPath}`);
    redirectPath = "/";
  }

  // Disable Draft Mode
  const draft = await draftMode();
  draft.disable();

  // Redirect to the validated path
  return NextResponse.redirect(new URL(redirectPath, request.nextUrl.origin));
}
