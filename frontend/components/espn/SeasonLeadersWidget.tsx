"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import type { SimpleTeamLeaders, SimpleTeamLeader, SimpleTeam } from "@/lib/espn-types";

interface SeasonLeadersWidgetProps {
  /** Away/opponent team leaders */
  awayLeaders: SimpleTeamLeaders;
  /** Home team leaders (usually Clemson) */
  homeLeaders: SimpleTeamLeaders;
  /** Widget title */
  title?: string;
  className?: string;
}

/**
 * Season Leaders Widget - Compact design showing top players per stat category
 *
 * Features:
 * - Compact row-based layout
 * - Small headshots with team colors
 * - 5 stat categories: Points, Rebounds, Assists, Steals, Blocks
 * - Scroll-triggered stagger animation
 * - Responsive design
 */
export function SeasonLeadersWidget({
  awayLeaders,
  homeLeaders,
  title = "SEASON LEADERS",
  className,
}: SeasonLeadersWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  const categories: Array<{
    key: keyof Pick<SimpleTeamLeaders, "points" | "rebounds" | "assists" | "steals" | "blocks">;
    label: string;
    abbr: string;
  }> = [
    { key: "points", label: "Points", abbr: "PTS" },
    { key: "rebounds", label: "Rebounds", abbr: "REB" },
    { key: "assists", label: "Assists", abbr: "AST" },
    { key: "steals", label: "Steals", abbr: "STL" },
    { key: "blocks", label: "Blocks", abbr: "BLK" },
  ];

  return (
    <div
      ref={containerRef}
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {/* Header with team logos */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Away Team */}
          <div className="flex items-center gap-2">
            {awayLeaders.team.logo && (
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src={awayLeaders.team.logo}
                  alt={awayLeaders.team.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-bold text-xs text-gray-900 uppercase">
              {awayLeaders.team.abbreviation}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading text-xs font-bold text-gray-500 tracking-wide uppercase">
            {title}
          </h3>

          {/* Home Team */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-gray-900 uppercase">
              {homeLeaders.team.abbreviation}
            </span>
            {homeLeaders.team.logo && (
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src={homeLeaders.team.logo}
                  alt={homeLeaders.team.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Stat Rows */}
      <div className="divide-y divide-gray-100">
        {categories.map((category, index) => (
          <CompactStatRow
            key={category.key}
            label={category.label}
            abbr={category.abbr}
            awayLeader={awayLeaders[category.key]}
            homeLeader={homeLeaders[category.key]}
            awayTeam={awayLeaders.team}
            homeTeam={homeLeaders.team}
            isVisible={isVisible}
            delay={index * 80}
          />
        ))}
      </div>
    </div>
  );
}

interface CompactStatRowProps {
  label: string;
  abbr: string;
  awayLeader?: SimpleTeamLeader;
  homeLeader?: SimpleTeamLeader;
  awayTeam: SimpleTeam;
  homeTeam: SimpleTeam;
  isVisible: boolean;
  delay: number;
}

function CompactStatRow({
  label,
  abbr,
  awayLeader,
  homeLeader,
  awayTeam,
  homeTeam,
  isVisible,
  delay,
}: CompactStatRowProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimated(true), delay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  if (!awayLeader && !homeLeader) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-center px-3 py-2 transition-all duration-400",
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Away Player */}
      <CompactPlayerCell
        leader={awayLeader}
        team={awayTeam}
        align="left"
      />

      {/* Category Label */}
      <div className="px-3 text-center min-w-[60px]">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {abbr}
        </span>
      </div>

      {/* Home Player */}
      <CompactPlayerCell
        leader={homeLeader}
        team={homeTeam}
        align="right"
      />
    </div>
  );
}

interface CompactPlayerCellProps {
  leader?: SimpleTeamLeader;
  team: SimpleTeam;
  align: "left" | "right";
}

function CompactPlayerCell({ leader, team, align }: CompactPlayerCellProps) {
  if (!leader) {
    return (
      <div className={cn("flex items-center gap-2", align === "right" && "flex-row-reverse justify-start")}>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-300 text-[10px]">—</span>
        </div>
        <span className="text-xs text-gray-300">N/A</span>
      </div>
    );
  }

  // Generate initials for fallback
  const initials = leader.athlete.shortName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        align === "right" && "flex-row-reverse"
      )}
    >
      {/* Player Headshot */}
      {leader.athlete.headshot ? (
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
          <Image
            src={leader.athlete.headshot}
            alt={leader.athlete.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border"
          style={{
            backgroundColor: team.color ? `#${team.color}15` : "#f3f4f6",
            borderColor: team.color ? `#${team.color}30` : "#d1d5db",
          }}
        >
          <span
            className="text-[10px] font-bold"
            style={{ color: team.color ? `#${team.color}` : "#6b7280" }}
          >
            {initials}
          </span>
        </div>
      )}

      {/* Player Info */}
      <div className={cn("flex flex-col min-w-0", align === "right" && "items-end")}>
        <span className="text-xs font-medium text-gray-900 truncate max-w-[100px]">
          {leader.athlete.shortName}
        </span>
        <div className={cn("flex items-center gap-1", align === "right" && "flex-row-reverse")}>
          <span
            className="text-sm font-bold"
            style={{
              color: team.color ? `#${team.color}` : "var(--clemson-orange)",
            }}
          >
            {leader.stat.displayValue}
          </span>
          <span className="text-[10px] text-gray-400">
            #{leader.athlete.jersey || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
