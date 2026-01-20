# Technology Stack

**Analysis Date:** 2026-01-14

## Languages

**Primary:**
- TypeScript 5.x - All frontend application code (`frontend/`)
- PHP 7.4+ - WordPress theme backend (`functions.php`, `index.php`)

**Secondary:**
- CSS/SCSS - Styling via Tailwind CSS
- JavaScript - Build scripts, config files

## Runtime

**Environment:**
- Node.js 20.x (LTS) - Next.js runtime
- PHP (WordPress) - WordPress backend

**Package Manager:**
- npm 10.x
- Lockfile: `frontend/package-lock.json` (482KB, 511 dependencies)

## Frameworks

**Core:**
- Next.js 16.1.1 - React meta-framework (App Router) - `frontend/package.json`
- React 19.2.3 - UI library - `frontend/package.json`
- Tailwind CSS 4 - Utility-first styling - `frontend/postcss.config.mjs`

**Testing:**
- Vitest 4.0.17 - Unit testing - `frontend/vitest.config.ts`
- Playwright 1.57.0 - E2E testing - `frontend/playwright.config.ts`
- @testing-library/react 16.3.1 - Component testing

**Build/Dev:**
- Webpack (Next.js default, customized) - `frontend/next.config.ts`
- TypeScript 5.x - Type checking
- ESLint 9.x - Linting - `frontend/eslint.config.mjs`

## Key Dependencies

**Critical:**
- `@serwist/next` 10.0.0-preview.14 - PWA service worker - `frontend/next.config.ts`
- `@sentry/nextjs` 10.33.0 - Error tracking - `frontend/sentry.*.config.ts`
- `swr` 2.3.8 - Data fetching/caching - `frontend/lib/swr.ts`
- `zod` 4.3.5 - Schema validation - `frontend/lib/schemas/contact.ts`
- `react-hook-form` 7.70.0 - Form state management - `frontend/components/ContactForm.tsx`

**UI Components:**
- `@radix-ui/*` - Accessible UI primitives - `frontend/components/ui/`
- `cmdk` 1.1.1 - Command palette - `frontend/components/SearchCommand.tsx`
- `class-variance-authority` 0.7.1 - Component variants
- `lucide-react` 0.562.0 - Icon library

**Animations:**
- `gsap` 3.14.2 - Scroll animations - `frontend/components/ScrollAnimations.tsx`
- `headroom.js` 0.12.0 - Smart header - `frontend/components/Header.tsx`
- `tw-animate-css` 1.4.0 - Tailwind animations - `frontend/app/tw-animate.css`

**Media:**
- `video.js` 8.23.4 - Video player - `frontend/components/YouTubePlayer.tsx`
- `videojs-youtube` 3.0.1 - YouTube plugin
- `sharp` 0.34.5 - Image optimization

**Security:**
- `dompurify` 3.3.1 - HTML sanitization - `frontend/lib/sanitize.ts`

## Configuration

**Environment:**
- `.env.local` - Runtime environment variables
- `.env.example` - Variable documentation template
- Key configs: `WORDPRESS_API_URL`, `PREVIEW_SECRET`, `REVALIDATION_SECRET`, `SENTRY_DSN`

**Build:**
- `frontend/next.config.ts` - Next.js configuration (webpack, images, PWA)
- `frontend/tsconfig.json` - TypeScript compiler options
- `frontend/postcss.config.mjs` - PostCSS/Tailwind configuration
- `frontend/components.json` - shadcn/ui configuration

## Platform Requirements

**Development:**
- macOS/Linux/Windows (any platform with Node.js 20+)
- Local by Flywheel for WordPress development
- No Docker required

**Production:**
- Vercel - Next.js hosting (recommended)
- WordPress hosting (Flywheel, WP Engine, or similar)
- CDN for static assets

---

*Stack analysis: 2026-01-14*
*Update after major dependency changes*
