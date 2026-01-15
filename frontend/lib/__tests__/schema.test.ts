/**
 * Tests for Schema.org structured data generators
 */

import { describe, it, expect } from 'vitest'
import {
  generateOrganizationSchema,
  generateArticleSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateReviewSchema,
  combineSchemas,
} from '../schema'
import type { WPPost, WPService, WPTestimonial } from '../wordpress'

// Helper to create test data
function createTestWPPost(overrides: Partial<WPPost> = {}): WPPost {
  return {
    id: 1,
    date: '2026-01-12T12:00:00',
    date_gmt: '2026-01-12T12:00:00',
    modified: '2026-01-12T14:00:00',
    modified_gmt: '2026-01-12T14:00:00',
    slug: 'test-post',
    status: 'publish',
    type: 'post',
    link: 'https://example.com/blog/test-post',
    title: { rendered: 'Test Post Title' },
    content: { rendered: '<p>Test content</p>', protected: false },
    excerpt: { rendered: '<p>Test excerpt for the post.</p>', protected: false },
    author: 1,
    author_name: 'John Doe',
    featured_media: 0,
    featured_image_url: null,
    categories: [1],
    tags: [],
    ...overrides,
  }
}

function createTestWPService(overrides: Partial<WPService> = {}): WPService {
  return {
    id: 1,
    date: '2026-01-12T12:00:00',
    date_gmt: '2026-01-12T12:00:00',
    modified: '2026-01-12T14:00:00',
    modified_gmt: '2026-01-12T14:00:00',
    slug: 'web-development',
    status: 'publish',
    type: 'service',
    link: 'https://example.com/services/web-development',
    title: { rendered: 'Web Development' },
    content: { rendered: '<p>Professional web development services.</p>', protected: false },
    excerpt: { rendered: '<p>We build amazing websites.</p>', protected: false },
    featured_media: 0,
    featured_image_url: null,
    acf: {
      pricing: '$5000',
      duration: '4-6 weeks',
    },
    ...overrides,
  }
}

function createTestWPTestimonial(overrides: Partial<WPTestimonial> = {}): WPTestimonial {
  return {
    id: 1,
    date: '2026-01-12T12:00:00',
    date_gmt: '2026-01-12T12:00:00',
    modified: '2026-01-12T14:00:00',
    modified_gmt: '2026-01-12T14:00:00',
    slug: 'great-service',
    status: 'publish',
    type: 'testimonial',
    link: 'https://example.com/testimonials/great-service',
    title: { rendered: 'Great Service' },
    featured_media: 0,
    featured_image_url: null,
    acf: {
      client_name: 'Jane Smith',
      company: 'Acme Corp',
      quote: 'Absolutely fantastic service! Highly recommended.',
      rating: 5,
    },
    ...overrides,
  }
}

describe('Schema Generators', () => {
  describe('generateOrganizationSchema', () => {
    it('should return valid Organization schema with @context and @type', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
      })

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Organization')
    })

    it('should include required fields (name, url)', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
      })

      expect(schema.name).toBe('Acme Corp')
      expect(schema.url).toBe('https://acme.com')
    })

    it('should include logo as ImageObject when provided', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
        logo: 'https://acme.com/logo.png',
      })

      expect(schema.logo).toEqual({
        '@type': 'ImageObject',
        url: 'https://acme.com/logo.png',
      })
    })

    it('should include description when provided', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
        description: 'We make great products',
      })

      expect(schema.description).toBe('We make great products')
    })

    it('should include social profiles in sameAs', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
        sameAs: ['https://twitter.com/acme', 'https://linkedin.com/company/acme'],
      })

      expect(schema.sameAs).toEqual([
        'https://twitter.com/acme',
        'https://linkedin.com/company/acme',
      ])
    })

    it('should include contact point when provided', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
        contactPoint: {
          telephone: '+1-800-555-1234',
          email: 'info@acme.com',
          contactType: 'customer service',
        },
      })

      expect(schema.contactPoint).toEqual({
        '@type': 'ContactPoint',
        telephone: '+1-800-555-1234',
        email: 'info@acme.com',
        contactType: 'customer service',
      })
    })

    it('should include address when provided', () => {
      const schema = generateOrganizationSchema({
        name: 'Acme Corp',
        url: 'https://acme.com',
        address: {
          streetAddress: '123 Main St',
          addressLocality: 'San Francisco',
          addressRegion: 'CA',
          postalCode: '94102',
          addressCountry: 'US',
        },
      })

      expect(schema.address).toEqual({
        '@type': 'PostalAddress',
        streetAddress: '123 Main St',
        addressLocality: 'San Francisco',
        addressRegion: 'CA',
        postalCode: '94102',
        addressCountry: 'US',
      })
    })
  })

  describe('generateArticleSchema', () => {
    it('should return Article schema from WPPost', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com')

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BlogPosting')
    })

    it('should include headline and description', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com')

      expect(schema.headline).toBe('Test Post Title')
      expect(schema.description).toBe('Test excerpt for the post.')
    })

    it('should format dates correctly', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com')

      expect(schema.datePublished).toBe('2026-01-12T12:00:00')
      expect(schema.dateModified).toBe('2026-01-12T14:00:00')
    })

    it('should handle missing optional fields gracefully', () => {
      const post = createTestWPPost({
        author_name: undefined,
        featured_image_url: undefined,
      })
      const schema = generateArticleSchema(post, 'https://example.com')

      expect(schema.author).toEqual({
        '@type': 'Person',
        name: 'Unknown',
      })
      expect(schema.image).toBeUndefined()
    })

    it('should include featured image when available', () => {
      const post = createTestWPPost({
        featured_image_url: 'https://example.com/image.jpg',
      })
      const schema = generateArticleSchema(post, 'https://example.com')

      expect(schema.image).toEqual({
        '@type': 'ImageObject',
        url: 'https://example.com/image.jpg',
      })
    })

    it('should use custom author when provided', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com', {
        author: { name: 'Custom Author', url: 'https://example.com/author' },
      })

      expect(schema.author).toEqual({
        '@type': 'Person',
        name: 'Custom Author',
        url: 'https://example.com/author',
      })
    })

    it('should include publisher when provided', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com', {
        publisher: {
          name: 'Example Media',
          url: 'https://example.com',
          logo: 'https://example.com/logo.png',
        },
      })

      expect(schema.publisher).toEqual({
        '@type': 'Organization',
        name: 'Example Media',
        url: 'https://example.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.png',
        },
      })
    })

    it('should allow custom type (Article vs BlogPosting)', () => {
      const post = createTestWPPost()
      const schema = generateArticleSchema(post, 'https://example.com', {
        type: 'Article',
      })

      expect(schema['@type']).toBe('Article')
    })
  })

  describe('generateServiceSchema', () => {
    it('should return Service schema from WPService', () => {
      const service = createTestWPService()
      const schema = generateServiceSchema(service, 'https://example.com')

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Service')
    })

    it('should include name and description', () => {
      const service = createTestWPService()
      const schema = generateServiceSchema(service, 'https://example.com')

      expect(schema.name).toBe('Web Development')
      expect(schema.description).toBe('We build amazing websites.')
    })

    it('should map ACF pricing to offers', () => {
      const service = createTestWPService()
      const schema = generateServiceSchema(service, 'https://example.com')

      expect(schema.offers).toEqual({
        '@type': 'Offer',
        price: '$5000',
        priceCurrency: 'USD',
      })
    })

    it('should include provider when provided', () => {
      const service = createTestWPService()
      const schema = generateServiceSchema(service, 'https://example.com', {
        provider: { name: 'Acme Corp', url: 'https://acme.com' },
      })

      expect(schema.provider).toEqual({
        '@type': 'Organization',
        name: 'Acme Corp',
        url: 'https://acme.com',
      })
    })

    it('should include areaServed when provided', () => {
      const service = createTestWPService()
      const schema = generateServiceSchema(service, 'https://example.com', {
        areaServed: 'United States',
      })

      expect(schema.areaServed).toBe('United States')
    })

    it('should include image when featured_image_url is set', () => {
      const service = createTestWPService({
        featured_image_url: 'https://example.com/service.jpg',
      })
      const schema = generateServiceSchema(service, 'https://example.com')

      expect(schema.image).toBe('https://example.com/service.jpg')
    })
  })

  describe('generateBreadcrumbSchema', () => {
    it('should return BreadcrumbList with ordered items', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Blog', url: 'https://example.com/blog' },
        { name: 'Post', url: 'https://example.com/blog/post' },
      ]
      const schema = generateBreadcrumbSchema(breadcrumbs)

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('BreadcrumbList')
    })

    it('should include position, name, and item URL for each item', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://example.com' },
        { name: 'Blog', url: 'https://example.com/blog' },
      ]
      const schema = generateBreadcrumbSchema(breadcrumbs)

      expect(schema.itemListElement).toEqual([
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://example.com/blog',
        },
      ])
    })

    it('should handle empty breadcrumbs', () => {
      const schema = generateBreadcrumbSchema([])

      expect(schema.itemListElement).toEqual([])
    })
  })

  describe('generateFAQSchema', () => {
    it('should return FAQPage schema', () => {
      const faqs = [
        { question: 'What is your return policy?', answer: '30-day money-back guarantee.' },
      ]
      const schema = generateFAQSchema(faqs)

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('FAQPage')
    })

    it('should format question/answer pairs correctly', () => {
      const faqs = [
        { question: 'What is your return policy?', answer: '30-day money-back guarantee.' },
        { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide.' },
      ]
      const schema = generateFAQSchema(faqs)

      expect(schema.mainEntity).toEqual([
        {
          '@type': 'Question',
          name: 'What is your return policy?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '30-day money-back guarantee.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do you ship internationally?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, we ship worldwide.',
          },
        },
      ])
    })

    it('should handle empty FAQ list', () => {
      const schema = generateFAQSchema([])

      expect(schema.mainEntity).toEqual([])
    })
  })

  describe('generateReviewSchema', () => {
    it('should return Review schema from WPTestimonial', () => {
      const testimonial = createTestWPTestimonial()
      const schema = generateReviewSchema(testimonial)

      expect(schema['@context']).toBe('https://schema.org')
      expect(schema['@type']).toBe('Review')
    })

    it('should include author and review body', () => {
      const testimonial = createTestWPTestimonial()
      const schema = generateReviewSchema(testimonial)

      expect(schema.author).toEqual({
        '@type': 'Person',
        name: 'Jane Smith',
        worksFor: {
          '@type': 'Organization',
          name: 'Acme Corp',
        },
      })
      expect(schema.reviewBody).toBe('Absolutely fantastic service! Highly recommended.')
    })

    it('should include rating when present', () => {
      const testimonial = createTestWPTestimonial()
      const schema = generateReviewSchema(testimonial)

      expect(schema.reviewRating).toEqual({
        '@type': 'Rating',
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      })
    })

    it('should not include rating when missing', () => {
      const testimonial = createTestWPTestimonial({
        acf: {
          client_name: 'John Doe',
          quote: 'Great service!',
          rating: undefined,
        },
      })
      const schema = generateReviewSchema(testimonial)

      expect(schema.reviewRating).toBeUndefined()
    })

    it('should include itemReviewed when provided', () => {
      const testimonial = createTestWPTestimonial()
      const schema = generateReviewSchema(testimonial, {
        itemReviewed: {
          name: 'Web Development Service',
          url: 'https://example.com/services/web-dev',
        },
      })

      expect(schema.itemReviewed).toEqual({
        '@type': 'Service',
        name: 'Web Development Service',
        url: 'https://example.com/services/web-dev',
      })
    })

    it('should use title as fallback for author name', () => {
      const testimonial = createTestWPTestimonial({
        acf: {
          quote: 'Great service!',
        },
      })
      const schema = generateReviewSchema(testimonial)

      expect((schema.author as Record<string, unknown>).name).toBe('Great Service')
    })
  })

  describe('combineSchemas', () => {
    it('should combine multiple schemas into an array', () => {
      const org = generateOrganizationSchema({ name: 'Test', url: 'https://test.com' })
      const breadcrumbs = generateBreadcrumbSchema([{ name: 'Home', url: 'https://test.com' }])

      const combined = combineSchemas(org, breadcrumbs)

      expect(combined).toHaveLength(2)
      expect(combined[0]['@type']).toBe('Organization')
      expect(combined[1]['@type']).toBe('BreadcrumbList')
    })
  })
})
