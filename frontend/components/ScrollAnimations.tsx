'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollAnimations Component
 *
 * Initializes GSAP ScrollTrigger animations for elements with
 * data-animate attributes. Place this component once in your layout.
 *
 * Usage:
 * Add data-animate="fade-up" (or other animation types) to elements
 * you want to animate on scroll.
 *
 * Available animations:
 * - fade-up: Fade in while moving up
 * - fade-down: Fade in while moving down
 * - fade-left: Fade in while moving from left
 * - fade-right: Fade in while moving from right
 * - scale-up: Scale from 0.8 to 1 with fade
 * - stagger: Stagger children animations
 *
 * Options via data attributes:
 * - data-delay="0.2": Delay in seconds
 * - data-duration="0.6": Duration in seconds
 * - data-stagger="0.1": Stagger delay for children
 */
export function ScrollAnimations() {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in strict mode
    if (initialized.current) return;
    initialized.current = true;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Show all elements immediately if reduced motion is preferred
      gsap.set('[data-animate]', { opacity: 1, transform: 'none' });
      return;
    }

    // Animation configurations
    const animations: Record<string, gsap.TweenVars> = {
      'fade-up': {
        opacity: 0,
        y: 40,
      },
      'fade-down': {
        opacity: 0,
        y: -40,
      },
      'fade-left': {
        opacity: 0,
        x: -40,
      },
      'fade-right': {
        opacity: 0,
        x: 40,
      },
      'scale-up': {
        opacity: 0,
        scale: 0.8,
      },
    };

    // Find all animated elements
    const elements = document.querySelectorAll('[data-animate]');

    elements.forEach((element) => {
      const animationType = element.getAttribute('data-animate') || 'fade-up';
      const delay = parseFloat(element.getAttribute('data-delay') || '0');
      const duration = parseFloat(element.getAttribute('data-duration') || '0.6');
      const stagger = parseFloat(element.getAttribute('data-stagger') || '0.1');

      const fromVars = animations[animationType] || animations['fade-up'];

      if (animationType === 'stagger') {
        // Stagger animation for children
        const children = element.children;
        gsap.set(children, { opacity: 0, y: 30 });

        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease: 'power2.out',
              delay,
            });
          },
          once: true,
        });
      } else {
        // Set initial state
        gsap.set(element, fromVars);

        // Create scroll trigger
        ScrollTrigger.create({
          trigger: element,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration,
              ease: 'power2.out',
              delay,
            });
          },
          once: true,
        });
      }
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}

/**
 * Hook for programmatic scroll animations
 * Use this when you need more control over animations
 */
export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  options?: {
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up';
    duration?: number;
    delay?: number;
    start?: string;
  }
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, transform: 'none' });
      return;
    }

    const {
      animation = 'fade-up',
      duration = 0.6,
      delay = 0,
      start = 'top 85%',
    } = options || {};

    const animationProps: Record<string, gsap.TweenVars> = {
      'fade-up': { opacity: 0, y: 40 },
      'fade-down': { opacity: 0, y: -40 },
      'fade-left': { opacity: 0, x: -40 },
      'fade-right': { opacity: 0, x: 40 },
      'scale-up': { opacity: 0, scale: 0.8 },
    };

    gsap.set(element, animationProps[animation]);

    const trigger = ScrollTrigger.create({
      trigger: element,
      start,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          ease: 'power2.out',
          delay,
        });
      },
      once: true,
    });

    return () => {
      trigger.kill();
    };
  }, [ref, options]);
}
