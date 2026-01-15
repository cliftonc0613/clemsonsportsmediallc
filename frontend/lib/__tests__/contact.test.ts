/**
 * Tests for Contact Form Zod Validation Schema
 */

import { describe, it, expect } from 'vitest'
import { contactFormSchema, type ContactFormValues } from '../schemas/contact'

// Valid form data helper
function createValidFormData(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    message: 'This is a test message that is long enough.',
    ...overrides,
  }
}

describe('Contact Form Schema', () => {
  describe('valid input', () => {
    it('should accept valid form data with required fields only', () => {
      const data = createValidFormData()
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
        expect(result.data.email).toBe('john@example.com')
      }
    })

    it('should accept valid form data with all optional fields', () => {
      const data = createValidFormData({
        service: 'Web Development',
        budget: '$5,000 - $10,000',
        timeline: '1-2 months',
        referral: 'Google Search',
      })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.service).toBe('Web Development')
        expect(result.data.budget).toBe('$5,000 - $10,000')
      }
    })

    it('should accept empty optional fields', () => {
      const data = createValidFormData({
        service: undefined,
        budget: undefined,
        timeline: undefined,
        referral: undefined,
      })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })
  })

  describe('name validation', () => {
    it('should reject name shorter than 2 characters', () => {
      const data = createValidFormData({ name: 'J' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters')
      }
    })

    it('should accept name with exactly 2 characters', () => {
      const data = createValidFormData({ name: 'Jo' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should reject empty name', () => {
      const data = createValidFormData({ name: '' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should accept long names', () => {
      const data = createValidFormData({ name: 'Jonathan Bartholomew Smithington III' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should reject invalid email format', () => {
      const data = createValidFormData({ email: 'not-an-email' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address')
      }
    })

    it('should reject email without domain', () => {
      const data = createValidFormData({ email: 'user@' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should reject email without @', () => {
      const data = createValidFormData({ email: 'userexample.com' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should accept valid email with subdomain', () => {
      const data = createValidFormData({ email: 'user@mail.example.com' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept valid email with plus sign', () => {
      const data = createValidFormData({ email: 'user+tag@example.com' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })
  })

  describe('phone validation', () => {
    it('should accept US format with dashes', () => {
      const data = createValidFormData({ phone: '123-456-7890' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept US format with dots', () => {
      const data = createValidFormData({ phone: '123.456.7890' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept US format with parentheses', () => {
      const data = createValidFormData({ phone: '(123) 456-7890' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept format with country code', () => {
      const data = createValidFormData({ phone: '+1 123-456-7890' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept plain digits', () => {
      const data = createValidFormData({ phone: '1234567890' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept international format', () => {
      const data = createValidFormData({ phone: '+44 20 7946 0958' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should reject phone shorter than 10 characters', () => {
      const data = createValidFormData({ phone: '123456789' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Phone number must be at least 10 characters')
      }
    })

    it('should reject invalid phone format', () => {
      const data = createValidFormData({ phone: 'not-a-phone-number' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('message validation', () => {
    it('should reject message shorter than 10 characters', () => {
      const data = createValidFormData({ message: 'Too short' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Message must be at least 10 characters')
      }
    })

    it('should accept message with exactly 10 characters', () => {
      const data = createValidFormData({ message: 'Hello Worl' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept long messages', () => {
      const data = createValidFormData({
        message: 'This is a very long message that describes the project in detail. '.repeat(10),
      })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should reject empty message', () => {
      const data = createValidFormData({ message: '' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('honeypot field (website)', () => {
    it('should accept empty honeypot field', () => {
      const data = createValidFormData({ website: '' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should accept undefined honeypot field', () => {
      const data = createValidFormData({ website: undefined })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should reject filled honeypot field (bot detection)', () => {
      const data = createValidFormData({ website: 'https://spam.com' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Form submission rejected')
      }
    })

    it('should reject any value in honeypot field', () => {
      const data = createValidFormData({ website: 'x' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('required fields', () => {
    it('should reject missing name', () => {
      const { name, ...data } = createValidFormData()
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should reject missing email', () => {
      const { email, ...data } = createValidFormData()
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should reject missing phone', () => {
      const { phone, ...data } = createValidFormData()
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })

    it('should reject missing message', () => {
      const { message, ...data } = createValidFormData()
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle whitespace-only name', () => {
      const data = createValidFormData({ name: '   ' })
      const result = contactFormSchema.safeParse(data)

      // Whitespace counts as characters, so this passes min(2)
      expect(result.success).toBe(true)
    })

    it('should handle unicode characters in name', () => {
      const data = createValidFormData({ name: '田中太郎' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should handle emoji in message', () => {
      const data = createValidFormData({ message: 'Hello! 👋 I need help with my project.' })
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(true)
    })

    it('should handle multiple validation errors', () => {
      const data = {
        name: 'J',
        email: 'invalid',
        phone: '123',
        message: 'short',
      }
      const result = contactFormSchema.safeParse(data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })
  })
})
