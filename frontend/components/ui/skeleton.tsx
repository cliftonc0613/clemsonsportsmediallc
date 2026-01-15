import { cn } from "@/lib/utils";

/**
 * Skeleton Component
 *
 * A loading placeholder that mimics content shape.
 * Uses CSS animation for a shimmer effect.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
