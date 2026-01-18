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
 * Season Leaders Widget - Balanced compact design
 *
 * Features:
 * - Medium-sized headshots (48px) for good visibility
 * - Player info with secondary stats
 * - Centered stat display with category label
 * - 5 stat categories with staggered animation
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
    key: keyof Omit<SimpleTeamLeaders, "team">;
    label: string;
  }> = [
    { key: "points", label: "Points" },
    { key: "rebounds", label: "Rebounds" },
    { key: "assists", label: "Assists" },
    { key: "steals", label: "Steals" },
    { key: "blocks", label: "Blocks" },
    { key: "threePointers", label: "3PT Made" },
    { key: "minutes", label: "Minutes" },
  ];

  return (
    <div
      ref={containerRef}
      className={cn("bg-white rounded-lg shadow-sm overflow-hidden", className)}
    >
      {/* Title */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-heading text-base font-bold text-gray-900 tracking-wide">
          {title}
        </h3>
      </div>

      {/* Team Header Row */}
      <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Away Team */}
          <div className="flex items-center gap-2">
            {awayLeaders.team.logo && (
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src={awayLeaders.team.logo}
                  alt={awayLeaders.team.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="font-bold text-sm text-gray-900">
              {awayLeaders.team.abbreviation}
            </span>
          </div>

          {/* Center Label */}
          <span className="text-xs text-gray-400 font-medium px-4">
            Avg. Per Game
          </span>

          {/* Home Team */}
          <div className="flex items-center gap-2 justify-end">
            <span className="font-bold text-sm text-gray-900">
              {homeLeaders.team.abbreviation}
            </span>
            {homeLeaders.team.logo && (
              <div className="relative w-8 h-8 flex-shrink-0">
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

      {/* Stat Rows */}
      <div className="divide-y divide-gray-100">
        {categories.map((category, index) => (
          <LeaderRow
            key={category.key}
            label={category.label}
            awayLeader={awayLeaders[category.key]}
            homeLeader={homeLeaders[category.key]}
            awayTeam={awayLeaders.team}
            homeTeam={homeLeaders.team}
            isVisible={isVisible}
            delay={index * 100}
          />
        ))}
      </div>
    </div>
  );
}

interface LeaderRowProps {
  label: string;
  awayLeader?: SimpleTeamLeader;
  homeLeader?: SimpleTeamLeader;
  awayTeam: SimpleTeam;
  homeTeam: SimpleTeam;
  isVisible: boolean;
  delay: number;
}

function LeaderRow({
  label,
  awayLeader,
  homeLeader,
  awayTeam,
  homeTeam,
  isVisible,
  delay,
}: LeaderRowProps) {
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
        "grid grid-cols-[1fr_auto_1fr] items-center px-5 py-4 transition-all duration-500",
        animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Away Player */}
      <PlayerInfo
        leader={awayLeader}
        team={awayTeam}
        align="left"
      />

      {/* Center Stats */}
      <div className="flex items-center justify-center gap-3 px-4 min-w-[140px]">
        <span
          className="text-xl font-bold tabular-nums"
          style={{
            color: awayLeader && awayTeam.color ? `#${awayTeam.color}` : "#6b7280",
          }}
        >
          {awayLeader?.stat.displayValue || "—"}
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[70px] text-center">
          {label}
        </span>
        <span
          className="text-xl font-bold tabular-nums"
          style={{
            color: homeLeader && homeTeam.color ? `#${homeTeam.color}` : "#6b7280",
          }}
        >
          {homeLeader?.stat.displayValue || "—"}
        </span>
      </div>

      {/* Home Player */}
      <PlayerInfo
        leader={homeLeader}
        team={homeTeam}
        align="right"
      />
    </div>
  );
}

interface PlayerInfoProps {
  leader?: SimpleTeamLeader;
  team: SimpleTeam;
  align: "left" | "right";
}

function PlayerInfo({ leader, team, align }: PlayerInfoProps) {
  if (!leader) {
    return (
      <div className={cn(
        "flex items-center gap-3",
        align === "right" && "flex-row-reverse"
      )}>
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
          <span className="text-gray-300 text-xs">—</span>
        </div>
        <div className={cn("flex flex-col", align === "right" && "items-end")}>
          <span className="text-sm text-gray-300">No data</span>
        </div>
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
        "flex items-center gap-3",
        align === "right" && "flex-row-reverse"
      )}
    >
      {/* Player Headshot */}
      {leader.athlete.headshot ? (
        <div
          className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2"
          style={{
            borderColor: team.color ? `#${team.color}40` : "#e5e7eb",
          }}
        >
          <Image
            src={leader.athlete.headshot}
            alt={leader.athlete.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-2"
          style={{
            backgroundColor: team.color ? `#${team.color}10` : "#f3f4f6",
            borderColor: team.color ? `#${team.color}40` : "#e5e7eb",
          }}
        >
          <span
            className="text-sm font-bold"
            style={{ color: team.color ? `#${team.color}` : "#6b7280" }}
          >
            {initials}
          </span>
        </div>
      )}

      {/* Player Details */}
      <div className={cn("flex flex-col min-w-0", align === "right" && "items-end")}>
        {/* Name & Number */}
        <div className={cn("flex items-center gap-1.5", align === "right" && "flex-row-reverse")}>
          <span className="text-sm font-semibold text-gray-900 truncate">
            {leader.athlete.shortName}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            #{leader.athlete.jersey || "—"}
          </span>
        </div>

        {/* Position & Secondary Stats */}
        <div className={cn("flex items-center gap-1 text-xs text-gray-500", align === "right" && "flex-row-reverse")}>
          {leader.athlete.position && (
            <>
              <span className="font-medium">{leader.athlete.position}</span>
              {leader.secondaryStats && leader.secondaryStats.length > 0 && (
                <span className="text-gray-300">•</span>
              )}
            </>
          )}
          {leader.secondaryStats && leader.secondaryStats.slice(0, 2).map((stat, idx) => (
            <span key={idx} className="whitespace-nowrap">
              {stat.value} {stat.label}
              {idx === 0 && leader.secondaryStats && leader.secondaryStats.length > 1 && ", "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
