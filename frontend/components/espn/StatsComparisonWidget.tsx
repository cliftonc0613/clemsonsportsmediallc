"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { CLEMSON_TEAM_ID } from "@/lib/espn";
import { useEffect, useState, useRef } from "react";

/** Individual stat for comparison */
export interface ComparisonStat {
  /** Stat label (e.g., "Points", "Rebounds") */
  label: string;
  /** Away/opponent team value */
  awayValue: number;
  /** Home/Clemson team value */
  homeValue: number;
  /** Whether higher is better (true) or lower is better (false, e.g., Points Against) */
  higherIsBetter?: boolean;
  /** Format as percentage */
  isPercentage?: boolean;
}

/** Team info for the widget header */
export interface ComparisonTeam {
  id: string;
  name: string;
  abbreviation: string;
  logo?: string;
  color?: string;
}

interface StatsComparisonWidgetProps {
  /** Away/opponent team */
  awayTeam: ComparisonTeam;
  /** Home team (usually Clemson) */
  homeTeam: ComparisonTeam;
  /** Array of stats to compare */
  stats: ComparisonStat[];
  /** Widget title */
  title?: string;
  className?: string;
}

/**
 * Team stats comparison widget with horizontal bar visualization
 *
 * Features:
 * - Hatched/striped pattern for opponent stats
 * - Solid orange bars for Clemson stats
 * - Proportional bar widths based on values
 * - Animated bars on scroll into view
 * - Responsive design
 */
export function StatsComparisonWidget({
  awayTeam,
  homeTeam,
  stats,
  title = "TEAM STATS",
  className,
}: StatsComparisonWidgetProps) {
  const awayIsClemson = awayTeam.id === CLEMSON_TEAM_ID;
  const homeIsClemson = homeTeam.id === CLEMSON_TEAM_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Determine which team gets the solid orange bar
  const clemsonSide = homeIsClemson ? "home" : awayIsClemson ? "away" : "home";

  // Trigger animation when component comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-heading text-sm font-bold text-gray-900 tracking-wide uppercase">
          {title}
        </h3>
      </div>

      {/* Team Legend */}
      <div className="px-4 py-3 border-b border-dashed border-gray-200">
        <div className="flex items-center justify-between">
          {/* Away Team */}
          <div className="flex items-center gap-2">
            {awayTeam.logo && (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={awayTeam.logo}
                  alt={awayTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-3 rounded-sm flex-shrink-0"
                style={{
                  background:
                    clemsonSide === "away"
                      ? "var(--clemson-orange)"
                      : `repeating-linear-gradient(
                        -45deg,
                        ${awayTeam.color ? `#${awayTeam.color}` : "#666"},
                        ${awayTeam.color ? `#${awayTeam.color}` : "#666"} 1px,
                        transparent 1px,
                        transparent 3px
                      )`,
                }}
              />
              <span className="font-semibold text-sm text-gray-900">
                {awayTeam.abbreviation}
              </span>
            </div>
          </div>

          {/* Home Team */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-900">
                {homeTeam.abbreviation}
              </span>
              <span
                className="w-4 h-3 rounded-sm flex-shrink-0"
                style={{
                  background:
                    clemsonSide === "home"
                      ? "var(--clemson-orange)"
                      : `repeating-linear-gradient(
                        -45deg,
                        ${homeTeam.color ? `#${homeTeam.color}` : "#666"},
                        ${homeTeam.color ? `#${homeTeam.color}` : "#666"} 1px,
                        transparent 1px,
                        transparent 3px
                      )`,
                }}
              />
            </div>
            {homeTeam.logo && (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={homeTeam.logo}
                  alt={homeTeam.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Rows */}
      <div className="divide-y divide-gray-100">
        {stats.map((stat, index) => (
          <StatRow
            key={index}
            stat={stat}
            clemsonSide={clemsonSide}
            awayColor={awayTeam.color}
            homeColor={homeTeam.color}
            isVisible={isVisible}
            delay={index * 100} // Stagger animation by 100ms per row
          />
        ))}
      </div>
    </div>
  );
}

interface StatRowProps {
  stat: ComparisonStat;
  clemsonSide: "away" | "home";
  awayColor?: string;
  homeColor?: string;
  isVisible: boolean;
  delay: number;
}

function StatRow({
  stat,
  clemsonSide,
  awayColor,
  homeColor,
  isVisible,
  delay,
}: StatRowProps) {
  const {
    label,
    awayValue,
    homeValue,
    higherIsBetter = true,
    isPercentage = false,
  } = stat;
  const [animated, setAnimated] = useState(false);

  // Trigger animation after delay
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  // Calculate bar widths as percentage of the larger value
  const maxValue = Math.max(awayValue, homeValue);
  const awayWidth = maxValue > 0 ? (awayValue / maxValue) * 100 : 0;
  const homeWidth = maxValue > 0 ? (homeValue / maxValue) * 100 : 0;

  // Format display value
  const formatValue = (value: number) => {
    if (isPercentage) {
      return `${Math.round(value)}%`;
    }
    return value % 1 === 0 ? value.toString() : value.toFixed(1);
  };

  // Determine which team is "winning" this stat
  const awayWinning = higherIsBetter
    ? awayValue > homeValue
    : awayValue < homeValue;
  const homeWinning = higherIsBetter
    ? homeValue > awayValue
    : homeValue < awayValue;

  return (
    <div
      className={cn(
        "px-4 py-4 transition-all duration-500",
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Values and Label */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={cn(
            "font-bold text-lg tabular-nums transition-all duration-700",
            awayWinning && clemsonSide !== "away"
              ? "text-gray-600"
              : awayWinning
                ? "text-[var(--clemson-orange)]"
                : "text-gray-600"
          )}
          style={{ transitionDelay: `${delay + 200}ms` }}
        >
          {formatValue(awayValue)}
        </span>
        <span className="font-medium text-sm text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span
          className={cn(
            "font-bold text-lg tabular-nums transition-all duration-700",
            homeWinning && clemsonSide === "home"
              ? "text-[var(--clemson-orange)]"
              : homeWinning
                ? "text-gray-600"
                : "text-gray-600"
          )}
          style={{ transitionDelay: `${delay + 200}ms` }}
        >
          {formatValue(homeValue)}
        </span>
      </div>

      {/* Bar Visualization */}
      <div className="flex gap-1">
        {/* Away Team Bar (grows right to left) */}
        <div className="flex-1 flex justify-end">
          <div className="h-3 bg-gray-100 w-full rounded-l-sm overflow-hidden flex justify-end">
            <div
              className="h-full rounded-l-sm transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${awayWidth}%` : "0%",
                transitionDelay: `${delay + 100}ms`,
                background:
                  clemsonSide === "away"
                    ? "var(--clemson-orange)"
                    : `repeating-linear-gradient(
                      -45deg,
                      ${awayColor ? `#${awayColor}` : "#666"},
                      ${awayColor ? `#${awayColor}` : "#666"} 1px,
                      transparent 1px,
                      transparent 3px
                    )`,
              }}
            />
          </div>
        </div>

        {/* Home Team Bar (grows left to right) */}
        <div className="flex-1">
          <div className="h-3 bg-gray-100 w-full rounded-r-sm overflow-hidden">
            <div
              className="h-full rounded-r-sm transition-all duration-1000 ease-out"
              style={{
                width: animated ? `${homeWidth}%` : "0%",
                transitionDelay: `${delay + 100}ms`,
                background:
                  clemsonSide === "home"
                    ? "var(--clemson-orange)"
                    : `repeating-linear-gradient(
                      -45deg,
                      ${homeColor ? `#${homeColor}` : "#666"},
                      ${homeColor ? `#${homeColor}` : "#666"} 1px,
                      transparent 1px,
                      transparent 3px
                    )`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Basketball-specific preset stats
// =============================================================================

export const BASKETBALL_STATS = [
  "Points",
  "Points Against",
  "Field Goal %",
  "Rebounds",
  "Assists",
  "Blocks",
  "Steals",
] as const;

export type BasketballStatName = (typeof BASKETBALL_STATS)[number];

/** Helper to determine if higher is better for basketball stats */
export function isHigherBetter(statName: string): boolean {
  const lowerIsBetter = ["Points Against", "Turnovers", "Fouls"];
  return !lowerIsBetter.some((s) =>
    statName.toLowerCase().includes(s.toLowerCase())
  );
}

/** Helper to determine if stat is a percentage */
export function isPercentageStat(statName: string): boolean {
  return (
    statName.toLowerCase().includes("%") ||
    statName.toLowerCase().includes("percent") ||
    statName.toLowerCase().includes("pct")
  );
}
