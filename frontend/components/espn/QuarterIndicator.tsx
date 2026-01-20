import { cn } from "@/lib/utils";

interface QuarterIndicatorProps {
  /** Current period/quarter (1-indexed) */
  current: number;
  /** Total number of periods (4 for football, 2 for basketball halves) */
  total: number;
  /** Whether the game is complete */
  isComplete: boolean;
  className?: string;
}

/**
 * Displays quarter/period progress as dots
 * - Gray dots for incomplete or not yet played
 * - Orange dots for completed periods during active game
 * - All gray when game is final
 */
export function QuarterIndicator({
  current,
  total,
  isComplete,
  className,
}: QuarterIndicatorProps) {
  return (
    <div className={cn("flex justify-center gap-2", className)}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-3 h-3 rounded-full transition-colors",
            isComplete
              ? "bg-gray-300"
              : i < current
                ? "bg-[var(--clemson-orange)]"
                : "bg-gray-300"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
