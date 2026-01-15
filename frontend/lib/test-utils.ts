/**
 * Test Utilities
 *
 * Custom render functions, factory functions, and testing helpers.
 */

import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'

// Re-export everything from testing-library for convenience
export * from '@testing-library/react'

/**
 * Custom render function that wraps components with necessary providers.
 * Extend this when adding global providers (theme, router, etc.)
 */
function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { ...options })
}

// Override default render with custom render
export { customRender as render }

// =============================================================================
// Factory Functions for Test Data
// =============================================================================

/**
 * Create a test post with sensible defaults.
 * Override any field by passing partial data.
 */
export function createTestPost(overrides: Partial<TestPost> = {}): TestPost {
  return {
    id: 1,
    slug: 'test-post',
    title: { rendered: 'Test Post Title' },
    excerpt: { rendered: '<p>Test excerpt content.</p>', protected: false },
    content: { rendered: '<p>Test post content.</p>', protected: false },
    date: '2026-01-12T12:00:00',
    modified: '2026-01-12T12:00:00',
    author: 1,
    featured_media: 0,
    categories: [1],
    tags: [],
    ...overrides,
  }
}

/**
 * Create a test service with sensible defaults.
 */
export function createTestService(overrides: Partial<TestService> = {}): TestService {
  return {
    id: 1,
    slug: 'test-service',
    title: { rendered: 'Test Service' },
    excerpt: { rendered: '<p>Test service description.</p>', protected: false },
    content: { rendered: '<p>Full service content.</p>', protected: false },
    date: '2026-01-12T12:00:00',
    modified: '2026-01-12T12:00:00',
    featured_media: 0,
    acf: {
      pricing: '$100',
      duration: '1 hour',
    },
    ...overrides,
  }
}

/**
 * Create a test page with sensible defaults.
 */
export function createTestPage(overrides: Partial<TestPage> = {}): TestPage {
  return {
    id: 1,
    slug: 'test-page',
    title: { rendered: 'Test Page' },
    content: { rendered: '<p>Test page content.</p>', protected: false },
    date: '2026-01-12T12:00:00',
    modified: '2026-01-12T12:00:00',
    parent: 0,
    ...overrides,
  }
}

// =============================================================================
// Type Definitions for Test Data
// =============================================================================

interface TestPost {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string; protected: boolean }
  content: { rendered: string; protected: boolean }
  date: string
  modified: string
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
}

interface TestService {
  id: number
  slug: string
  title: { rendered: string }
  excerpt: { rendered: string; protected: boolean }
  content: { rendered: string; protected: boolean }
  date: string
  modified: string
  featured_media: number
  acf?: {
    pricing?: string
    duration?: string
    features?: Array<{ feature: string }>
  }
}

interface TestPage {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string; protected: boolean }
  date: string
  modified: string
  parent: number
}
