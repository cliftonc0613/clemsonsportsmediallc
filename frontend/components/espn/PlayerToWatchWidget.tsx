"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { SimpleTeam } from "@/lib/espn-types";

/**
 * Player stats for the widget
 */
export interface PlayerStats {
  ppg?: number;     // Points per game
  reb?: number;     // Rebounds
  ast?: number;     // Assists
  stl?: number;     // Steals
  min?: number;     // Minutes
  fgPct?: number;   // Field goal percentage
}

/**
 * Player data for the widget
 */
export interface PlayerToWatchData {
  id: string;
  name: string;
  shortName: string;
  jersey?: string;
  position: string;
  headshot?: string;
  team: SimpleTeam;
  stats: PlayerStats;
  /** Optional highlight text (e.g., "Season Leader", "Hot Streak") */
  highlight?: string;
}

/**
 * Layout variant options for the widget
 * - default: Original compact layout
 * - watermark: Large jersey number as subtle background watermark
 * - side-panel: Vertical left column with jersey number and rank badge
 * - hero: Full-width with massive jersey number background element
 */
export type PlayerToWatchVariant = "default" | "watermark" | "side-panel" | "hero";

interface PlayerToWatchWidgetProps {
  player: PlayerToWatchData;
  title?: string;
  className?: string;
  /** Layout variant - default | watermark | side-panel | hero */
  variant?: PlayerToWatchVariant;
}

/**
 * Player to Watch Widget
 *
 * Features:
 * - Large player headshot with team color accent
 * - Player name, number, and position
 * - 6-stat grid with animated count-up effect
 * - Intersection observer triggers animation on scroll
 * - Responsive design matching theme styles
 * - Multiple layout variants available
 */
export function PlayerToWatchWidget({
  player,
  title = "PLAYER TO WATCH",
  className,
  variant = "default",
}: PlayerToWatchWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // Generate initials for fallback
  const initials = player.shortName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const teamColor = player.team.color ? `#${player.team.color}` : "var(--clemson-orange)";

  const stats: Array<{
    key: keyof PlayerStats;
    label: string;
    isPercentage?: boolean;
  }> = [
    { key: "ppg", label: "PPG" },
    { key: "reb", label: "REB" },
    { key: "ast", label: "AST" },
    { key: "stl", label: "STL" },
    { key: "min", label: "MIN" },
    { key: "fgPct", label: "FG%", isPercentage: true },
  ];

  // Render based on variant
  switch (variant) {
    case "watermark":
      return (
        <WatermarkVariant
          player={player}
          title={title}
          className={className}
          containerRef={containerRef}
          isVisible={isVisible}
          initials={initials}
          teamColor={teamColor}
          stats={stats}
        />
      );
    case "side-panel":
      return (
        <SidePanelVariant
          player={player}
          title={title}
          className={className}
          containerRef={containerRef}
          isVisible={isVisible}
          initials={initials}
          teamColor={teamColor}
          stats={stats}
        />
      );
    case "hero":
      return (
        <HeroVariant
          player={player}
          title={title}
          className={className}
          containerRef={containerRef}
          isVisible={isVisible}
          initials={initials}
          teamColor={teamColor}
          stats={stats}
        />
      );
    default:
      return (
        <DefaultVariant
          player={player}
          title={title}
          className={className}
          containerRef={containerRef}
          isVisible={isVisible}
          initials={initials}
          teamColor={teamColor}
          stats={stats}
        />
      );
  }
}

// Shared props interface for all variants
interface VariantProps {
  player: PlayerToWatchData;
  title: string;
  className?: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  initials: string;
  teamColor: string;
  stats: Array<{
    key: keyof PlayerStats;
    label: string;
    isPercentage?: boolean;
  }>;
}

/**
 * Default Variant - Original compact layout
 */
function DefaultVariant({
  player,
  title,
  className,
  containerRef,
  isVisible,
  initials,
  teamColor,
  stats,
}: VariantProps) {
  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-gray-900 dark:text-foreground tracking-wide">
            {title}
          </h3>
          {player.highlight && (
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${teamColor}15`,
                color: teamColor,
              }}
            >
              {player.highlight}
            </span>
          )}
        </div>
      </div>

      {/* Player Info Section */}
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          {/* Large Headshot */}
          <PlayerHeadshot
            player={player}
            initials={initials}
            teamColor={teamColor}
            isVisible={isVisible}
            size="default"
          />

          {/* Player Details */}
          <PlayerDetails
            player={player}
            teamColor={teamColor}
            isVisible={isVisible}
          />
        </div>

        {/* Stats Grid */}
        <StatsGrid
          stats={stats}
          playerStats={player.stats}
          teamColor={teamColor}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
}

/**
 * Variation A: Watermark Variant
 * Large jersey number as subtle background watermark with team logo accent
 */
function WatermarkVariant({
  player,
  title,
  className,
  containerRef,
  isVisible,
  initials,
  teamColor,
  stats,
}: VariantProps) {
  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden relative",
        className
      )}
    >
      {/* Large Jersey Number Watermark */}
      {player.jersey && (
        <div
          className={cn(
            "absolute -left-4 -top-4 pointer-events-none select-none transition-all duration-700",
            isVisible ? "opacity-[0.06]" : "opacity-0"
          )}
          style={{ color: teamColor }}
        >
          <span className="text-[12rem] font-heading font-black leading-none">
            #{player.jersey}
          </span>
        </div>
      )}

      {/* Team Logo Watermark (corner accent) */}
      {player.team.logo && (
        <div
          className={cn(
            "absolute right-4 bottom-4 w-16 h-16 pointer-events-none select-none transition-all duration-700 delay-200",
            isVisible ? "opacity-[0.08]" : "opacity-0"
          )}
        >
          <Image
            src={player.team.logo}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-border relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-gray-900 dark:text-foreground tracking-wide">
            {title}
          </h3>
          {player.highlight && (
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${teamColor}15`,
                color: teamColor,
              }}
            >
              {player.highlight}
            </span>
          )}
        </div>
      </div>

      {/* Player Info Section */}
      <div className="p-5 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          {/* Large Headshot */}
          <PlayerHeadshot
            player={player}
            initials={initials}
            teamColor={teamColor}
            isVisible={isVisible}
            size="large"
          />

          {/* Player Details */}
          <PlayerDetails
            player={player}
            teamColor={teamColor}
            isVisible={isVisible}
          />
        </div>

        {/* Stats Grid */}
        <StatsGrid
          stats={stats}
          playerStats={player.stats}
          teamColor={teamColor}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
}

/**
 * Variation B: Side Panel Variant
 * Vertical left column with jersey number, rank badge, and accent bar
 */
function SidePanelVariant({
  player,
  title,
  className,
  containerRef,
  isVisible,
  initials,
  teamColor,
  stats,
}: VariantProps) {
  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header - Full Width */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-border">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-gray-900 dark:text-foreground tracking-wide">
            {title}
          </h3>
          {player.highlight && (
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                backgroundColor: `${teamColor}15`,
                color: teamColor,
              }}
            >
              {player.highlight}
            </span>
          )}
        </div>
      </div>

      {/* Main Content with Side Panel */}
      <div className="flex">
        {/* Left Side Panel */}
        <div
          className={cn(
            "w-24 flex-shrink-0 flex flex-col items-center justify-center py-6 transition-all duration-500",
            isVisible ? "opacity-100" : "opacity-0"
          )}
          style={{ backgroundColor: `${teamColor}10` }}
        >
          {/* Large Jersey Number */}
          {player.jersey && (
            <div
              className="text-5xl font-heading font-black leading-none mb-3"
              style={{ color: teamColor }}
            >
              #{player.jersey}
            </div>
          )}

          {/* Rank Badge */}
          {player.highlight && (
            <div
              className="px-2 py-1 rounded text-xs font-bold text-white text-center"
              style={{ backgroundColor: teamColor }}
            >
              {player.highlight}
            </div>
          )}

          {/* Team-colored Accent Bar */}
          <div
            className="w-1 flex-1 mt-4 rounded-full"
            style={{ backgroundColor: teamColor }}
          />
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-5">
          <div className="flex items-center gap-4 mb-6">
            {/* Headshot */}
            <PlayerHeadshot
              player={player}
              initials={initials}
              teamColor={teamColor}
              isVisible={isVisible}
              size="default"
            />

            {/* Player Details (without jersey - it's in side panel) */}
            <div
              className={cn(
                "flex flex-col transition-all duration-500 delay-100",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
              )}
            >
              {/* Team Logo + Abbreviation */}
              <div className="flex items-center gap-2 mb-1">
                {player.team.logo && (
                  <div className="relative w-5 h-5 flex-shrink-0">
                    <Image
                      src={player.team.logo}
                      alt={player.team.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wide">
                  {player.team.abbreviation}
                </span>
              </div>

              {/* Name */}
              <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-foreground leading-tight">
                {player.name}
              </h4>

              {/* Position only (jersey is in side panel) */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600 dark:text-muted-foreground font-medium">
                  {player.position}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <StatsGrid
            stats={stats}
            playerStats={player.stats}
            teamColor={teamColor}
            isVisible={isVisible}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Variation C: Hero Card Variant
 * Full-width with massive jersey number background, prominent stats
 */
function HeroVariant({
  player,
  title,
  className,
  containerRef,
  isVisible,
  initials,
  teamColor,
  stats,
}: VariantProps) {
  return (
    <div
      ref={containerRef}
      className={cn(
        "bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden relative",
        className
      )}
    >
      {/* Massive Jersey Number Background */}
      {player.jersey && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center pointer-events-none select-none transition-all duration-1000",
            isVisible ? "opacity-[0.04]" : "opacity-0"
          )}
          style={{ color: teamColor }}
        >
          <span className="text-[20rem] font-heading font-black leading-none">
            {player.jersey}
          </span>
        </div>
      )}

      {/* Team Logo Watermark */}
      {player.team.logo && (
        <div
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none select-none transition-all duration-700 delay-300",
            isVisible ? "opacity-[0.06]" : "opacity-0"
          )}
        >
          <Image
            src={player.team.logo}
            alt=""
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 dark:border-border relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-base font-bold text-gray-900 dark:text-foreground tracking-wide">
            {title}
          </h3>
          {player.highlight && (
            <span
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: teamColor,
                color: "white",
              }}
            >
              {player.highlight}
            </span>
          )}
        </div>
      </div>

      {/* Hero Player Section */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          {/* Extra Large Headshot */}
          <PlayerHeadshot
            player={player}
            initials={initials}
            teamColor={teamColor}
            isVisible={isVisible}
            size="hero"
          />

          {/* Player Details - Larger Typography */}
          <div
            className={cn(
              "flex flex-col items-center sm:items-start transition-all duration-500 delay-150",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Team Logo + Abbreviation */}
            <div className="flex items-center gap-2 mb-2">
              {player.team.logo && (
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={player.team.logo}
                    alt={player.team.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-sm font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wide">
                {player.team.abbreviation}
              </span>
            </div>

            {/* Name - Extra Large */}
            <h4 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900 dark:text-foreground leading-tight text-center sm:text-left">
              {player.name}
            </h4>

            {/* Position & Jersey */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-base text-gray-600 dark:text-muted-foreground font-medium">
                {player.position}
              </span>
              {player.jersey && (
                <>
                  <span className="text-gray-300 dark:text-border">•</span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: teamColor }}
                  >
                    #{player.jersey}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid - Larger */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {stats.map((stat, index) => (
            <AnimatedStat
              key={stat.key}
              label={stat.label}
              value={player.stats[stat.key]}
              isPercentage={stat.isPercentage}
              teamColor={teamColor}
              isVisible={isVisible}
              delay={250 + index * 60}
              size="large"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Reusable Components

interface PlayerHeadshotProps {
  player: PlayerToWatchData;
  initials: string;
  teamColor: string;
  isVisible: boolean;
  size?: "default" | "large" | "hero";
}

function PlayerHeadshot({
  player,
  initials,
  teamColor,
  isVisible,
  size = "default",
}: PlayerHeadshotProps) {
  const sizeClasses = {
    default: "w-20 h-20",
    large: "w-24 h-24",
    hero: "w-28 h-28 sm:w-32 sm:h-32",
  };

  const textSizes = {
    default: "text-2xl",
    large: "text-3xl",
    hero: "text-4xl",
  };

  if (player.headshot) {
    return (
      <div
        className={cn(
          "relative rounded-full overflow-hidden flex-shrink-0",
          "transition-all duration-500",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          sizeClasses[size]
        )}
        style={{
          borderColor: `${teamColor}50`,
          borderWidth: "3px",
        }}
      >
        <Image
          src={player.headshot}
          alt={player.name}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center flex-shrink-0",
        "transition-all duration-500",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        sizeClasses[size]
      )}
      style={{
        backgroundColor: `${teamColor}15`,
        borderColor: `${teamColor}50`,
        borderWidth: "3px",
      }}
    >
      <span
        className={cn("font-bold", textSizes[size])}
        style={{ color: teamColor }}
      >
        {initials}
      </span>
    </div>
  );
}

interface PlayerDetailsProps {
  player: PlayerToWatchData;
  teamColor: string;
  isVisible: boolean;
}

function PlayerDetails({ player, teamColor, isVisible }: PlayerDetailsProps) {
  return (
    <div
      className={cn(
        "flex flex-col transition-all duration-500 delay-100",
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
      )}
    >
      {/* Team Logo + Abbreviation */}
      <div className="flex items-center gap-2 mb-1">
        {player.team.logo && (
          <div className="relative w-5 h-5 flex-shrink-0">
            <Image
              src={player.team.logo}
              alt={player.team.name}
              fill
              className="object-contain"
            />
          </div>
        )}
        <span className="text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wide">
          {player.team.abbreviation}
        </span>
      </div>

      {/* Name */}
      <h4 className="text-xl font-heading font-bold text-gray-900 dark:text-foreground leading-tight">
        {player.name}
      </h4>

      {/* Position & Jersey */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-sm text-gray-600 dark:text-muted-foreground font-medium">
          {player.position}
        </span>
        {player.jersey && (
          <>
            <span className="text-gray-300 dark:text-border">•</span>
            <span
              className="text-sm font-bold"
              style={{ color: teamColor }}
            >
              #{player.jersey}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{
    key: keyof PlayerStats;
    label: string;
    isPercentage?: boolean;
  }>;
  playerStats: PlayerStats;
  teamColor: string;
  isVisible: boolean;
}

function StatsGrid({ stats, playerStats, teamColor, isVisible }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <AnimatedStat
          key={stat.key}
          label={stat.label}
          value={playerStats[stat.key]}
          isPercentage={stat.isPercentage}
          teamColor={teamColor}
          isVisible={isVisible}
          delay={200 + index * 80}
        />
      ))}
    </div>
  );
}

interface AnimatedStatProps {
  label: string;
  value: number | undefined;
  isPercentage?: boolean;
  teamColor: string;
  isVisible: boolean;
  delay: number;
  size?: "default" | "large";
}

function AnimatedStat({
  label,
  value,
  isPercentage = false,
  teamColor,
  isVisible,
  delay,
  size = "default",
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const duration = 1200;

  useEffect(() => {
    if (isVisible && !hasAnimated && value !== undefined) {
      setHasAnimated(true);

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
    }
  }, [isVisible, hasAnimated, value, delay]);

  // Format display value
  const formattedValue = value !== undefined
    ? isPercentage
      ? `${displayValue.toFixed(1)}%`
      : displayValue.toFixed(1)
    : "—";

  return (
    <div
      className={cn(
        "text-center bg-gray-50 dark:bg-muted rounded-lg transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        size === "large" ? "p-4" : "p-3"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "font-bold tabular-nums",
          size === "large" ? "text-2xl sm:text-3xl" : "text-2xl"
        )}
        style={{ color: teamColor }}
      >
        {formattedValue}
      </div>
      <div
        className={cn(
          "text-gray-500 dark:text-muted-foreground uppercase tracking-wide mt-1 font-medium",
          size === "large" ? "text-xs sm:text-sm" : "text-xs"
        )}
      >
        {label}
      </div>
    </div>
  );
}
