# Coding Conventions

**Analysis Date:** 2026-01-14

## Naming Patterns

**Files:**
- `kebab-case.ts` for utility modules (`rate-limit.ts`, `web-vitals.ts`, `content-images.ts`)
- `PascalCase.tsx` for React components (`Hero.tsx`, `BlogCard.tsx`, `ContactForm.tsx`)
- `*.test.ts` for test files (co-located in `__tests__/`)
- `route.ts` for API route handlers (Next.js convention)

**Functions:**
- `camelCase` for all functions
- `get*()` prefix for data fetching (`getPosts()`, `getServices()`, `getTestimonials()`)
- `generate*()` prefix for generators (`generateOrganizationSchema()`, `generateArticleSchema()`)
- `is*()` prefix for boolean checks (`isWordPressConfigured()`)
- `handle*()` prefix for event handlers

**Variables:**
- `camelCase` for variables
- `SCREAMING_SNAKE_CASE` for environment variables (`WORDPRESS_API_URL`, `PREVIEW_SECRET`)
- No underscore prefix for private members

**Types:**
- `PascalCase` for interfaces and types
- `WP*` prefix for WordPress types (`WPPost`, `WPService`, `WPTestimonial`, `WPImage`)
- `*Props` suffix for component props (`HeroProps`, `BlogCardProps`)
- `*Schema` suffix for Zod schemas (`contactFormSchema`)
- `*Values` suffix for inferred types (`ContactFormValues`)

## Code Style

**Formatting:**
- 2-space indentation
- Double quotes for strings
- Semicolons required
- Modern ES module syntax (`import`/`export`)

**Linting:**
- ESLint 9.x with flat config (`frontend/eslint.config.mjs`)
- Extends: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`
- Ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`
- Run: `npm run lint`

**TypeScript:**
- Strict mode enabled
- Target: ES2017
- Module: ESNext with bundler resolution
- JSX: react-jsx (automatic)
- Path alias: `@/*` points to root

## Import Organization

**Order:**
1. React/Next.js core (`'react'`, `'next/*'`)
2. External packages (`'zod'`, `'@radix-ui/*'`)
3. Internal modules (`'@/lib/*'`, `'@/components/*'`)
4. Relative imports (`'./*'`, `'../*'`)
5. Type imports (`import type {}`)

**Path Aliases:**
- `@/*` maps to `frontend/` root
- Example: `import { cn } from '@/lib/utils'`

## Error Handling

**Patterns:**
- Try/catch at API route boundaries
- Graceful degradation in data fetching (return empty arrays/null)
- Structured error responses with `success`, `error`, `details` fields
- Zod validation errors include field-level details

**Error Types:**
- Throw on invalid input at API boundaries
- Return null/empty for missing WordPress content
- Log errors with context via `frontend/lib/logger.ts`

**Example:**
```typescript
try {
  const result = contactFormSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ success: false, error: 'Validation failed', details: result.error.issues }, { status: 400 });
  }
} catch (error) {
  console.error('Contact form error:', error);
  return NextResponse.json({ success: false, error: 'Failed to process' }, { status: 500 });
}
```

## Logging

**Framework:**
- Custom logger: `frontend/lib/logger.ts`
- Levels: debug, info, warn, error

**Patterns:**
- Structured logging with context objects
- Environment-aware: verbose in dev, minimal in prod
- Timestamp, level, message, context format
- No `console.log` in production code (use logger)

**Example:**
```typescript
logger.info('Contact form submitted', { email: validatedData.email });
logger.error('Failed to fetch posts', error, { endpoint: 'posts' });
```

## Comments

**When to Comment:**
- Explain "why" not "what"
- Document business logic and edge cases
- JSDoc for exported functions and types
- TODO comments for incomplete features

**JSDoc/TSDoc:**
- Required for public API functions in `lib/`
- Use `@param`, `@returns`, `@throws` tags
- Example from `frontend/lib/logger.ts`:
  ```typescript
  /**
   * Error logs - shown in all environments
   * Consider integrating with error tracking service (Sentry, etc.)
   */
  ```

**TODO Comments:**
- Format: `// TODO: description`
- Example: `// TODO: Send email notification`
- Link to issues when applicable

## Function Design

**Size:**
- Keep under 50 lines
- Extract helpers for complex logic
- One responsibility per function

**Parameters:**
- Max 3 parameters
- Use options object for 4+ parameters
- Destructure in function signature

**Return Values:**
- Explicit return types for public functions
- Return early for guard clauses
- Use `null` for "not found" cases

## Module Design

**Exports:**
- Named exports preferred
- Default exports only for page components
- Group related exports in barrel files

**Component Structure:**
```typescript
// 1. Imports
import { ... } from '...'

// 2. Types
interface ComponentProps { ... }

// 3. Component
export function Component({ prop1, prop2 }: ComponentProps) {
  // hooks
  // handlers
  // render
}
```

**Utility Structure:**
```typescript
// 1. Imports
import { ... } from '...'

// 2. Types/Interfaces
interface Config { ... }

// 3. Constants
const DEFAULT_VALUE = ...

// 4. Exported functions
export function utilityFunction() { ... }
```

---

*Convention analysis: 2026-01-14*
*Update when patterns change*
