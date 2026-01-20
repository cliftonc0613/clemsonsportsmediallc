# Codebase Concerns

**Analysis Date:** 2026-01-14

## Tech Debt

**Contact Form Email Not Implemented:**
- Issue: Contact form submission doesn't actually send emails
- Files: `frontend/app/api/contact/route.ts`
- Why: Multiple email provider options commented out during development
- Impact: Form submissions only log to console, no notification to site owner
- Fix approach: Uncomment and configure one provider (Resend, SendGrid, etc.)

**Sentry Integration Incomplete:**
- Issue: Logger has TODO comment for Sentry integration
- Files: `frontend/lib/logger.ts`
- Why: Sentry SDK is installed but not fully integrated with custom logger
- Impact: Custom logger errors not forwarded to Sentry
- Fix approach: Uncomment Sentry.captureException in logger.error()

**Default Secrets in .env.local:**
- Issue: Preview and revalidation secrets still have default values
- Files: `frontend/.env.local`
- Why: Development setup not updated for production
- Impact: Security risk if deployed without changing secrets
- Fix approach: Generate secure random strings before production deployment

## Known Bugs

*No critical bugs identified during analysis.*

## Security Considerations

**Default Secret Values:**
- Risk: `PREVIEW_SECRET` and `REVALIDATION_SECRET` use placeholder values
- Files: `frontend/.env.local` (line 5, 8)
- Current mitigation: Only affects local development
- Recommendations:
  - Generate secure secrets before production: `openssl rand -base64 32`
  - Add pre-deployment checklist for secret rotation
  - Consider using a secrets manager

**Rate Limiting Present:**
- Status: Good - Contact form has rate limiting implemented
- Files: `frontend/lib/rate-limit.ts`, `frontend/app/api/contact/route.ts`
- Implementation: 5 submissions per minute per IP
- Note: Rate limiting is in-memory, resets on server restart

**HTML Sanitization Present:**
- Status: Good - DOMPurify used for WordPress content
- Files: `frontend/lib/sanitize.ts`
- Implementation: Sanitizes HTML before rendering

**Honeypot Field Present:**
- Status: Good - Bot detection via hidden field
- Files: `frontend/lib/schemas/contact.ts`
- Implementation: `website` field must be empty

## Performance Bottlenecks

*No significant performance issues identified. Key optimizations already in place:*

**ISR Caching:**
- Status: Configured with 5-second revalidation
- Files: `frontend/app/page.tsx`, various page components

**Image Optimization:**
- Status: Next.js Image component with sharp

**Service Worker:**
- Status: PWA caching via Serwist

## Fragile Areas

**WordPress API Configuration:**
- Files: `frontend/lib/wordpress.ts`
- Why fragile: Multiple functions depend on `WORDPRESS_API_URL` environment variable
- Common failures: Empty responses if WordPress is unreachable
- Safe modification: Check `isWordPressConfigured()` before API calls
- Test coverage: Has unit tests with mocked fetch

**Environment Variable Dependencies:**
- Files: `frontend/lib/wordpress.ts`, `frontend/app/api/*/route.ts`
- Why fragile: Many features disabled without proper env configuration
- Common failures: Silent failures, missing content
- Safe modification: Use `isWordPressConfigured()` pattern
- Recommendation: Add startup validation for required env vars

## Scaling Limits

**Rate Limiting Storage:**
- Current capacity: In-memory Map, resets on restart
- Limit: Single server instance only
- Symptoms at limit: Rate limits don't persist across deploys
- Scaling path: Use Redis or similar for distributed rate limiting

## Dependencies at Risk

**tw-animate-css:**
- Risk: Required custom webpack config for module resolution
- Files: `frontend/next.config.ts` (webpack alias)
- Impact: Build failures without the alias
- Note: Already mitigated with webpack configuration

**@serwist/next (Preview):**
- Risk: Using preview version (10.0.0-preview.14)
- Files: `frontend/package.json`
- Impact: May have breaking changes in stable release
- Migration plan: Update when stable version released

## Missing Critical Features

**Email Notifications:**
- Problem: Contact form doesn't send email notifications
- Files: `frontend/app/api/contact/route.ts`
- Current workaround: Manual console log checking
- Blocks: Production contact form functionality
- Implementation complexity: Low (providers already templated)

**Newsletter Subscription:**
- Problem: No newsletter/Mailchimp integration
- Current workaround: N/A - feature not implemented
- Blocks: Email list building
- Implementation complexity: Medium (requires Mailchimp API setup)

**Search Functionality Limited:**
- Problem: Search only queries posts, not pages/services
- Files: `frontend/app/api/search/route.ts`
- Current workaround: Users can browse categories
- Blocks: Full-site search
- Implementation complexity: Low (extend existing search)

## Test Coverage Gaps

**E2E Tests:**
- What's not tested: Full user flows
- Files: `frontend/e2e/` (may be empty)
- Risk: UI regressions undetected
- Priority: Medium
- Difficulty to test: Playwright configured but tests need writing

**Component Tests:**
- What's not tested: React component rendering
- Risk: UI component failures
- Priority: Low (components are mostly presentational)
- Difficulty to test: @testing-library/react available

**API Route Integration:**
- What's not tested: Full request/response cycle
- Risk: API contract changes undetected
- Priority: Medium
- Difficulty to test: Need test server setup

---

*Concerns audit: 2026-01-14*
*Update as issues are fixed or new ones discovered*
