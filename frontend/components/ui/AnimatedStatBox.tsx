"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedStatBoxProps {
  label: string;
  value: number | undefined;
  isPercentage?: boolean;
  duration?: number; // Animation duration in ms
  delay?: number; // Delay before starting animation
}

/**
 * Stat box with animated count-up effect
 * Triggers animation when scrolled into view
 */
export function AnimatedStatBox({
  label,
  value,
  isPercentage = false,
  duration = 1500,
  delay = 0,
}: AnimatedStatBoxProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Animate when element comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated && value) {
          setHasAnimated(true);

          // Start animation after delay
          const startTime = performance.now() + delay;
          const targetValue = value;

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;

            if (elapsed < 0) {
              requestAnimationFrame(animate);
              return;
            }

            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = targetValue * easeOut;

            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(targetValue);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated, duration, delay]);

  // Format display value
  const formattedValue = value
    ? isPercentage
      ? `${displayValue.toFixed(1)}%`
      : displayValue.toFixed(1)
    : "—";

  return (
    <div ref={ref} className="text-center p-3 bg-gray-50 rounded-lg">
      <div className="text-2xl font-bold text-[var(--clemson-orange)] tabular-nums">
        {formattedValue}
      </div>
      <div className="text-xs text-gray-500 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}

/**
 * Container for animated stat boxes with staggered delays
 */
interface AnimatedStatsGridProps {
  stats: Array<{
    label: string;
    value: number | undefined;
    isPercentage?: boolean;
  }>;
  className?: string;
}

export function AnimatedStatsGrid({ stats, className }: AnimatedStatsGridProps) {
  return (
    <div className={className}>
      {stats.map((stat, index) => (
        <AnimatedStatBox
          key={stat.label}
          label={stat.label}
          value={stat.value}
          isPercentage={stat.isPercentage}
          delay={index * 100} // Stagger by 100ms per stat
        />
      ))}
    </div>
  );
}
