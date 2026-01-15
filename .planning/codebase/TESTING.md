# Testing Patterns

**Analysis Date:** 2026-01-14

## Test Framework

**Runner:**
- Vitest 4.0.17
- Config: `frontend/vitest.config.ts`

**Environment:**
- `jsdom` for browser simulation
- Global test utilities enabled

**Assertion Library:**
- Vitest built-in expect
- @testing-library/jest-dom matchers

**Run Commands:**
```bash
npm test                              # Watch mode
npm run test:run                      # Single run
npm run test:coverage                 # Coverage report
npm run test:e2e                      # Playwright E2E tests
npm run test:e2e:ui                   # E2E with interactive UI
```

## Test File Organization

**Location:**
- `frontend/lib/__tests__/*.test.ts` - Co-located with source
- `frontend/e2e/*.e2e.ts` - E2E tests (separate directory)

**Naming:**
- `*.test.ts` for unit tests
- `*.e2e.ts` for E2E tests

**Structure:**
```
frontend/
├── lib/
│   ├── wordpress.ts
│   ├── schema.ts
│   ├── utils.ts
│   └── __tests__/
│       ├── wordpress.test.ts
│       ├── schema.test.ts
│       ├── utils.test.ts
│       └── contact.test.ts
└── e2e/
    └── *.e2e.ts
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    it('should handle valid input', () => {
      // arrange
      const input = createTestData()

      // act
      const result = functionName(input)

      // assert
      expect(result).toEqual(expectedOutput)
    })

    it('should throw on invalid input', () => {
      expect(() => functionName(null)).toThrow('error message')
    })
  })
})
```

**Patterns:**
- Use `beforeEach` for per-test setup
- Use `vi.resetAllMocks()` to restore mocks
- Arrange/Act/Assert structure
- One assertion focus per test

## Mocking

**Framework:**
- Vitest built-in mocking (`vi`)
- Module mocking via `vi.mock()`

**Patterns:**
```typescript
import { vi } from 'vitest'

// Mock module
vi.mock('./external', () => ({
  externalFunction: vi.fn()
}))

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment
process.env = { ...originalEnv, WORDPRESS_API_URL: '...' }

// Mock return value
vi.mocked(fetchData).mockResolvedValue({ data: 'test' })
```

**What to Mock:**
- External APIs (fetch calls)
- File system operations
- Environment variables
- External services

**What NOT to Mock:**
- Internal pure functions
- Simple utilities
- TypeScript types

## Fixtures and Factories

**Test Data:**
```typescript
// Factory function pattern
function createValidFormData(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    message: 'Test message content',
    ...overrides
  }
}

// WordPress data factory
function createTestWPPost(overrides: Partial<WPPost> = {}): WPPost {
  return {
    id: 1,
    date: '2026-01-12T12:00:00',
    slug: 'test-post',
    title: { rendered: 'Test Post' },
    ...overrides
  }
}
```

**Location:**
- Factory functions defined in test file
- Shared fixtures in `__tests__/fixtures/` if needed

## Coverage

**Requirements:**
- No enforced coverage target
- Coverage tracked for awareness
- Focus on critical paths

**Configuration:**
- Provider: v8
- Reporters: text, json, html

**View Coverage:**
```bash
npm run test:coverage
open coverage/index.html
```

## Test Types

**Unit Tests (Vitest):**
- Test single function in isolation
- Mock external dependencies
- Fast execution (<100ms per test)
- Location: `lib/__tests__/*.test.ts`

**Schema Validation Tests:**
- Test Zod schemas with various inputs
- Cover success and error paths
- Test edge cases (empty, null, special chars)
- Example: `lib/__tests__/contact.test.ts`

**E2E Tests (Playwright):**
- Framework: Playwright 1.57.0
- Config: `frontend/playwright.config.ts`
- Browsers: Chromium (desktop), mobile-chrome (Pixel 5)
- Base URL: `http://localhost:3000`
- Location: `frontend/e2e/*.e2e.ts`

## Common Patterns

**Async Testing:**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction()
  expect(result).toBe('expected')
})
```

**Error Testing:**
```typescript
it('should throw on invalid input', () => {
  expect(() => functionCall()).toThrow('error message')
})

// Async error
it('should reject on failure', async () => {
  await expect(asyncCall()).rejects.toThrow('error message')
})
```

**Zod Schema Testing:**
```typescript
it('validates correct data', () => {
  const data = createValidFormData()
  const result = contactFormSchema.safeParse(data)
  expect(result.success).toBe(true)
})

it('rejects invalid email', () => {
  const data = createValidFormData({ email: 'invalid' })
  const result = contactFormSchema.safeParse(data)
  expect(result.success).toBe(false)
  expect(result.error?.issues[0].path).toContain('email')
})
```

**Mock Fetch Testing:**
```typescript
it('fetches posts from WordPress', async () => {
  const mockPosts = [createTestWPPost()]
  mockFetch.mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockPosts)
  })

  const posts = await getPosts()
  expect(posts).toHaveLength(1)
  expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('/posts'))
})
```

## Test Coverage Areas

**Well Covered:**
- Zod schema validation (`contact.test.ts`)
- Utility functions (`utils.test.ts`)
- Schema.org generators (`schema.test.ts`)
- WordPress API client (`wordpress.test.ts`)

**Coverage Gaps:**
- E2E tests directory exists but may be empty
- Component tests not visible
- No visible integration tests

---

*Testing analysis: 2026-01-14*
*Update when test patterns change*
