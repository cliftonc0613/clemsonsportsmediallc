'use client';

import { useEffect, useState } from 'react';

/**
 * Reading Progress Indicator
 *
 * Shows a progress bar at the top of the page indicating how far
 * the user has scrolled through the article content.
 *
 * Features:
 * - Smooth animation with CSS transitions
 * - Uses requestAnimationFrame for performance
 * - Respects prefers-reduced-motion
 * - Customizable colors via CSS variables
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let rafId: number;
    let ticking = false;

    const calculateProgress = () => {
      const article = document.querySelector('article');
      if (!article) {
        setIsVisible(false);
        return;
      }

      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = articleRect.height;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate progress based on article position
      const start = articleTop - windowHeight * 0.5;
      const end = articleTop + articleHeight - windowHeight * 0.5;
      const current = scrollY;

      if (current < start) {
        setProgress(0);
        setIsVisible(false);
      } else if (current > end) {
        setProgress(100);
        setIsVisible(true);
      } else {
        const progressPercent = ((current - start) / (end - start)) * 100;
        setProgress(Math.min(100, Math.max(0, progressPercent)));
        setIsVisible(true);
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        rafId = requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-1 w-full bg-neutral-200 dark:bg-neutral-800"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-[var(--clemson-orange)] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
