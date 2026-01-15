# Codebase Structure

**Analysis Date:** 2026-01-14

## Directory Layout

```
clemsonsportsmedia/
├── frontend/                    # Next.js frontend application
│   ├── app/                    # App Router pages & routes
│   ├── components/             # React components
│   ├── lib/                    # Utility functions & abstractions
│   ├── public/                 # Static assets
│   ├── types/                  # TypeScript type definitions
│   └── [config files]          # next.config.ts, tsconfig.json, etc.
├── acf-json/                   # ACF field group configurations
├── context/                    # Project context files
├── knowledge/                  # Content and research
├── .claude/                    # Claude Code configuration
├── functions.php               # WordPress theme setup
├── index.php                   # WordPress homepage template
├── style.css                   # WordPress stylesheet
├── CLAUDE.md                   # Project documentation
└── README.md                   # Setup instructions
```

## Directory Purposes

**frontend/**
- Purpose: Next.js 16 frontend application
- Contains: All React code, pages, components, utilities
- Key files: `package.json`, `next.config.ts`, `tsconfig.json`
- Subdirectories: app/, components/, lib/, public/

**frontend/app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, layouts, loading states, error boundaries
- Key files: `page.tsx` (homepage), `layout.tsx` (root layout)
- Subdirectories: blog/, services/, contact/, api/

**frontend/app/api/**
- Purpose: Next.js API route handlers
- Contains: Server-side endpoints for forms, search, preview
- Key files: `contact/route.ts`, `search/route.ts`, `revalidate/route.ts`

**frontend/components/**
- Purpose: Reusable React components
- Contains: UI components, page sections, forms
- Key files: `Header.tsx`, `Footer.tsx`, `ContactForm.tsx`, `BlogCard.tsx`
- Subdirectories: ui/ (shadcn), storybrand/ (framework components)

**frontend/components/ui/**
- Purpose: shadcn/ui primitive components
- Contains: Button, Card, Dialog, Accordion, Form, etc.
- Key files: `button.tsx`, `card.tsx`, `dialog.tsx`, `accordion.tsx`

**frontend/components/storybrand/**
- Purpose: StoryBrand framework components
- Contains: Hero, Problem, Guide, Plan, CTA sections
- Key files: `StoryBrandHero.tsx`, `ProblemSection.tsx`, `PlanSteps.tsx`

**frontend/lib/**
- Purpose: Utility functions, API clients, helpers
- Contains: WordPress client, schema generators, validators
- Key files: `wordpress.ts`, `schema.ts`, `sanitize.ts`, `rate-limit.ts`
- Subdirectories: `schemas/` (Zod), `hooks/` (React hooks), `__tests__/` (unit tests)

**frontend/public/**
- Purpose: Static assets served as-is
- Contains: Images, icons, PWA manifest
- Key files: `manifest.json`, `logo.png`
- Subdirectories: icons/, screenshots/

**acf-json/**
- Purpose: ACF field group version control
- Contains: JSON exports of ACF configurations
- Key files: `group_homepage_settings.json`, `group_services_fields.json`

## Key File Locations

**Entry Points:**
- `frontend/app/layout.tsx` - Root layout (providers, header, footer)
- `frontend/app/page.tsx` - Homepage (StoryBrand template)
- `functions.php` - WordPress theme initialization
- `index.php` - WordPress fallback template

**Configuration:**
- `frontend/next.config.ts` - Next.js build & runtime config
- `frontend/tsconfig.json` - TypeScript compiler options
- `frontend/.env.local` - Environment variables
- `frontend/.env.example` - Environment variable template
- `frontend/postcss.config.mjs` - PostCSS/Tailwind config
- `frontend/vitest.config.ts` - Unit test configuration
- `frontend/playwright.config.ts` - E2E test configuration

**Core Logic:**
- `frontend/lib/wordpress.ts` - WordPress API client
- `frontend/lib/schema.ts` - Schema.org generators
- `frontend/lib/sanitize.ts` - HTML sanitization
- `frontend/lib/rate-limit.ts` - Rate limiting
- `frontend/lib/seo.ts` - SEO utilities

**Testing:**
- `frontend/lib/__tests__/` - Unit tests (co-located)
- `frontend/vitest.setup.ts` - Test setup file
- `frontend/e2e/` - E2E tests (if exists)

**Documentation:**
- `README.md` - Setup and deployment guide
- `DEPLOYMENT.md` - Deployment instructions
- `CLAUDE.md` - Project documentation for AI

## Naming Conventions

**Files:**
- `kebab-case.ts` - Utility modules (`rate-limit.ts`, `web-vitals.ts`)
- `PascalCase.tsx` - React components (`Hero.tsx`, `BlogCard.tsx`)
- `*.test.ts` - Test files (co-located in `__tests__/`)
- `route.ts` - API route handlers (Next.js convention)
- `page.tsx`, `layout.tsx`, `loading.tsx` - Page files (Next.js convention)

**Directories:**
- `kebab-case` - All directories
- Plural for collections: `components/`, `lib/`, `hooks/`
- Singular for features: `app/blog/`, `app/contact/`

**Special Patterns:**
- `[slug]` - Dynamic route segments
- `__tests__` - Test directories
- `.env*` - Environment configuration
- `*.config.*` - Configuration files

## Where to Add New Code

**New Page:**
- Implementation: `frontend/app/[page-name]/page.tsx`
- Loading state: `frontend/app/[page-name]/loading.tsx`
- Types: Add to `frontend/lib/wordpress.ts` if new data type

**New Component:**
- Implementation: `frontend/components/ComponentName.tsx`
- Skeleton: `frontend/components/ComponentNameSkeleton.tsx`
- If UI primitive: `frontend/components/ui/component-name.tsx`

**New API Route:**
- Implementation: `frontend/app/api/[endpoint]/route.ts`
- Types: Add to `frontend/lib/` or inline

**New Utility:**
- Implementation: `frontend/lib/utility-name.ts`
- Tests: `frontend/lib/__tests__/utility-name.test.ts`

**New WordPress Integration:**
- Fetch function: Add to `frontend/lib/wordpress.ts`
- Types: Add interface to `frontend/lib/wordpress.ts`
- Schema: Add to `frontend/lib/schema.ts` if needs JSON-LD

**New StoryBrand Section:**
- Implementation: `frontend/components/storybrand/SectionName.tsx`
- Add to homepage: `frontend/app/page.tsx`

## Special Directories

**frontend/.next/**
- Purpose: Next.js build output
- Source: Generated during build
- Committed: No (in .gitignore)

**frontend/node_modules/**
- Purpose: npm dependencies
- Source: `npm install`
- Committed: No (in .gitignore)

**acf-json/**
- Purpose: ACF field group sync
- Source: Auto-exported by ACF plugin
- Committed: Yes (version controlled)

**.claude/**
- Purpose: Claude Code configuration
- Contains: Agents, commands, skills
- Committed: Yes

---

*Structure analysis: 2026-01-14*
*Update when directory structure changes*
