/**
 * Tests for WordPress API client functions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  getPosts,
  getPost,
  getCategories,
  getTags,
  search,
  stripHtml,
  decodeHtmlEntities,
  formatDate,
  getReadingTime,
} from '../wordpress'
import { createTestPost, createTestService } from '../test-utils'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock environment variable
const originalEnv = process.env

describe('WordPress API Client', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...originalEnv, WORDPRESS_API_URL: 'https://test.com/wp-json/wp/v2' }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getPosts', () => {
    it('should return array of posts from mocked API', async () => {
      const mockPosts = [createTestPost({ id: 1 }), createTestPost({ id: 2 })]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      })

      const posts = await getPosts()

      expect(posts).toHaveLength(2)
      expect(posts[0].id).toBe(1)
      expect(posts[1].id).toBe(2)
    })

    it('should handle empty response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const posts = await getPosts()

      expect(posts).toHaveLength(0)
      expect(posts).toEqual([])
    })

    it('should pass query params correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await getPosts({ per_page: 5, categories: [1, 2], tags: [3] })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('per_page=5')
      expect(calledUrl).toContain('categories=1%2C2')
      expect(calledUrl).toContain('tags=3')
      expect(calledUrl).toContain('_embed=true')
    })

    it('should throw error when API URL is not configured', async () => {
      process.env.WORDPRESS_API_URL = undefined

      await expect(getPosts()).rejects.toThrow('WORDPRESS_API_URL environment variable is not set')
    })

    it('should throw error on non-OK response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(getPosts()).rejects.toThrow('WordPress API Error: 500 Internal Server Error')
    })
  })

  describe('getPost', () => {
    it('should return single post by slug', async () => {
      const mockPost = createTestPost({ slug: 'test-post' })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([mockPost]),
      })

      const post = await getPost('test-post')

      expect(post).not.toBeNull()
      expect(post?.slug).toBe('test-post')
    })

    it('should return null for non-existent slug', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      const post = await getPost('non-existent')

      expect(post).toBeNull()
    })

    it('should include _embed param for embedded data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await getPost('test-post')

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('_embed=true')
    })
  })

  describe('getCategories', () => {
    it('should return taxonomy terms', async () => {
      const mockCategories = [
        { id: 1, name: 'Tech', slug: 'tech', count: 5, description: '', link: '', parent: 0 },
        { id: 2, name: 'News', slug: 'news', count: 3, description: '', link: '', parent: 0 },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      })

      const categories = await getCategories()

      expect(categories).toHaveLength(2)
      expect(categories[0].name).toBe('Tech')
    })

    it('should respect hide_empty parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await getCategories({ hide_empty: false })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('hide_empty=false')
    })
  })

  describe('getTags', () => {
    it('should return taxonomy terms', async () => {
      const mockTags = [
        { id: 1, name: 'JavaScript', slug: 'javascript', count: 10, description: '', link: '' },
      ]
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTags),
      })

      const tags = await getTags()

      expect(tags).toHaveLength(1)
      expect(tags[0].name).toBe('JavaScript')
    })

    it('should respect hide_empty parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      })

      await getTags({ hide_empty: true })

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('hide_empty=true')
    })
  })

  describe('search', () => {
    it('should combine results from multiple content types', async () => {
      // Mock three parallel fetch calls (posts, pages, services)
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, slug: 'post-1', title: { rendered: 'Post 1' }, excerpt: { rendered: 'Excerpt' } },
          ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { id: 2, slug: 'page-1', title: { rendered: 'Page 1' }, content: { rendered: 'Content' } },
          ]),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { id: 3, slug: 'service-1', title: { rendered: 'Service 1' }, excerpt: { rendered: 'Service desc' } },
          ]),
        })

      const results = await search({ query: 'test' })

      // Should include WordPress results plus any static pages matching 'test'
      expect(results.length).toBeGreaterThanOrEqual(3)
    })

    it('should handle partial failures gracefully', async () => {
      // Posts succeeds, pages fails, services succeeds
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, slug: 'post-1', title: { rendered: 'Post 1' }, excerpt: { rendered: 'Excerpt' } },
          ]),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve([
            { id: 3, slug: 'service-1', title: { rendered: 'Service 1' }, excerpt: { rendered: 'Desc' } },
          ]),
        })

      // Should not throw, should return partial results
      const results = await search({ query: 'test' })

      // At minimum, we should get the post and service results
      expect(results.length).toBeGreaterThanOrEqual(2)
    })

    it('should return empty array for empty query', async () => {
      const results = await search({ query: '' })

      expect(results).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should return empty array for whitespace-only query', async () => {
      const results = await search({ query: '   ' })

      expect(results).toEqual([])
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })
})

describe('WordPress Utility Functions', () => {
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World')
    })

    it('should handle empty string', () => {
      expect(stripHtml('')).toBe('')
    })

    it('should trim whitespace', () => {
      expect(stripHtml('  <p>Hello</p>  ')).toBe('Hello')
    })
  })

  describe('decodeHtmlEntities', () => {
    it('should decode common entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&')
      expect(decodeHtmlEntities('&lt;')).toBe('<')
      expect(decodeHtmlEntities('&gt;')).toBe('>')
      expect(decodeHtmlEntities('&quot;')).toBe('"')
    })

    it('should decode smart quotes', () => {
      expect(decodeHtmlEntities('&#8220;Hello&#8221;')).toBe('"Hello"')
    })

    it('should handle multiple entities in one string', () => {
      expect(decodeHtmlEntities('Tom &amp; Jerry &lt;3')).toBe('Tom & Jerry <3')
    })

    it('should preserve unknown entities', () => {
      expect(decodeHtmlEntities('&unknown;')).toBe('&unknown;')
    })
  })

  describe('formatDate', () => {
    it('should format WordPress date to readable string', () => {
      const formatted = formatDate('2026-01-12T12:00:00')
      expect(formatted).toBe('January 12, 2026')
    })

    it('should handle different date formats', () => {
      // Use ISO format with time to avoid timezone issues
      const formatted = formatDate('2025-06-15T12:00:00')
      expect(formatted).toBe('June 15, 2025')
    })
  })

  describe('getReadingTime', () => {
    it('should calculate reading time for content', () => {
      // 200 words = 1 minute at 200 WPM
      const content = 'word '.repeat(200)
      expect(getReadingTime(content)).toBe(1)
    })

    it('should round up to nearest minute', () => {
      // 250 words = 1.25 minutes, rounded up to 2
      const content = 'word '.repeat(250)
      expect(getReadingTime(content)).toBe(2)
    })

    it('should strip HTML before counting words', () => {
      const content = '<p>' + 'word '.repeat(100) + '</p>'
      expect(getReadingTime(content)).toBe(1)
    })
  })
})
