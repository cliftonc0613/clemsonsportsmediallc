import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Item {
  icon?: React.ReactNode;
  value?: string;
  title: string;
  description?: string;
}

type Variant = "stakes" | "stats" | "features";

interface StakesSectionProps {
  variant?: Variant;
  heading?: string;
  subheading?: string;
  badge?: string;
  badgeIcon?: React.ReactNode;
  items?: Item[];
  columns?: 2 | 3 | 4;
  ctaText?: string;
  ctaHref?: string;
  ctaMessage?: string;
  showCta?: boolean;
  showBadge?: boolean;
  showPattern?: boolean;
  className?: string;
}

// Variant-specific styles
const variantStyles = {
  stakes: {
    section: "bg-muted/30",
    badge: "border-neutral-300 bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    card: "border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600",
    icon: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
  },
  stats: {
    section: "bg-muted/30 border-y",
    badge: "border-primary/20 bg-primary/10 text-primary",
    card: "border-transparent hover:border-primary/20",
    icon: "bg-primary/10 text-primary",
  },
  features: {
    section: "bg-background",
    badge: "border-primary/20 bg-primary/10 text-primary",
    card: "border-border hover:border-primary/30 hover:shadow-md",
    icon: "bg-primary/10 text-primary",
  },
};

// Default items per variant
const defaultItems: Record<Variant, Item[]> = {
  stakes: [
    {
      icon: <TrendingDown className="h-8 w-8" />,
      title: "[STAKE 1: Lost Opportunity]",
      description: "[What opportunity are they missing? Be specific about the cost of inaction.]",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "[STAKE 2: Wasted Time]",
      description: "[How is their current approach wasting time?]",
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "[STAKE 3: Growing Problem]",
      description: "[How does this problem get worse over time?]",
    },
  ],
  stats: [
    { value: "10+", title: "Years Experience" },
    { value: "200+", title: "Projects Completed" },
    { value: "50+", title: "Happy Clients" },
    { value: "99%", title: "Client Satisfaction" },
  ],
  features: [
    { title: "[Feature 1]", description: "[Feature description]" },
    { title: "[Feature 2]", description: "[Feature description]" },
    { title: "[Feature 3]", description: "[Feature description]" },
  ],
};

/**
 * StoryBrand Stakes Section (Reusable)
 *
 * A flexible section component with multiple variants:
 *
 * - `stakes` (default): Show what's at risk if they DON'T act (orange/warning style)
 * - `stats`: Display achievements/numbers in a clean grid
 * - `features`: Highlight features or benefits
 *
 * @example Stakes (default)
 * <StakesSection
 *   heading="What Happens If You Wait?"
 *   items={[{ icon: <Clock />, title: "Lost Time", description: "..." }]}
 * />
 *
 * @example Stats
 * <StakesSection
 *   variant="stats"
 *   items={[{ value: "10+", title: "Years Experience" }]}
 *   showBadge={false}
 *   showCta={false}
 * />
 */
export function StakesSection({
  variant = "stakes",
  heading = variant === "stakes" ? "What Happens If You Wait?" : undefined,
  subheading,
  badge = variant === "stakes" ? "Consider This" : undefined,
  badgeIcon = variant === "stakes" ? <AlertTriangle className="h-4 w-4" /> : undefined,
  items,
  columns = variant === "stats" ? 4 : 3,
  ctaText = "Don't Wait - Get Started",
  ctaHref = "/contact",
  ctaMessage = "You don't have to stay stuck. Taking action today means [POSITIVE OUTCOME] tomorrow.",
  showCta = variant === "stakes",
  showBadge = variant === "stakes",
  showPattern = variant === "stakes",
  className,
}: StakesSectionProps) {
  const styles = variantStyles[variant];
  const displayItems = items || defaultItems[variant];

  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden py-16 md:py-24",
        styles.section,
        className
      )}
    >
      {/* Subtle pattern background (stakes variant) */}
      {showPattern && (
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 20px,
                currentColor 20px,
                currentColor 22px
              )`,
            }}
          />
        </div>
      )}

      <div className="container relative mx-auto px-4">
        {/* Section header */}
        {(heading || subheading || showBadge) && (
          <div className="mb-12 text-center">
            {showBadge && badge && (
              <span
                className={cn(
                  "mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium",
                  styles.badge
                )}
              >
                {badgeIcon}
                {badge}
              </span>
            )}
            {heading && (
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Items grid */}
        <div className={cn("mx-auto grid max-w-5xl gap-6", gridCols[columns])}>
          {displayItems.map((item, index) => (
            <div
              key={index}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-background p-6 transition-all",
                variant === "stats" && "text-center",
                styles.card
              )}
            >
              {/* Icon (stakes/features) */}
              {item.icon && (
                <div
                  className={cn(
                    "mb-4 inline-flex rounded-lg p-3",
                    styles.icon
                  )}
                >
                  {item.icon}
                </div>
              )}

              {/* Value (stats) */}
              {item.value && (
                <div className="mb-2 text-3xl font-bold tracking-tight text-primary md:text-4xl">
                  {item.value}
                </div>
              )}

              {/* Title */}
              <h3
                className={cn(
                  "font-semibold",
                  variant === "stats"
                    ? "text-sm text-muted-foreground md:text-base"
                    : "mb-2 text-lg"
                )}
              >
                {item.title}
              </h3>

              {/* Description */}
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA section */}
        {showCta && (
          <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
            <p className="mb-6 text-lg">
              <span className="font-medium">The good news?</span>{" "}
              <span className="text-muted-foreground">{ctaMessage}</span>
            </p>
            <Button asChild size="lg">
              <Link href={ctaHref}>{ctaText}</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
