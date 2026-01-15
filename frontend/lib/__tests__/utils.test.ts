/**
 * Tests for utility functions
 */

import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  describe('basic class merging', () => {
    it('should merge multiple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle single class', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle undefined and null values', () => {
      expect(cn('foo', undefined, 'bar', null)).toBe('foo bar')
    })
  })

  describe('conditional classes', () => {
    it('should handle boolean conditions', () => {
      expect(cn('base', true && 'active')).toBe('base active')
      expect(cn('base', false && 'active')).toBe('base')
    })

    it('should handle object syntax', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('should handle array syntax', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('should handle mixed syntax', () => {
      expect(cn('base', ['arr1', 'arr2'], { obj: true })).toBe('base arr1 arr2 obj')
    })
  })

  describe('Tailwind merge behavior', () => {
    it('should merge conflicting padding classes', () => {
      // tailwind-merge should keep the last conflicting class
      expect(cn('p-4', 'p-8')).toBe('p-8')
    })

    it('should merge conflicting text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should merge conflicting background classes', () => {
      expect(cn('bg-white', 'bg-black')).toBe('bg-black')
    })

    it('should keep non-conflicting classes', () => {
      expect(cn('p-4', 'm-4', 'text-red-500')).toBe('p-4 m-4 text-red-500')
    })

    it('should handle responsive prefixes correctly', () => {
      expect(cn('p-4', 'md:p-8', 'lg:p-12')).toBe('p-4 md:p-8 lg:p-12')
    })

    it('should merge conflicting responsive classes', () => {
      expect(cn('md:p-4', 'md:p-8')).toBe('md:p-8')
    })

    it('should handle hover states', () => {
      expect(cn('hover:bg-red-500', 'hover:bg-blue-500')).toBe('hover:bg-blue-500')
    })
  })
})
