import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface Stat {
  value: string;
  label: string;
}

interface AboutSectionProps {
  badge?: string;
  heading?: string;
  paragraphs?: string[];
  image?: string;
  imageAlt?: string;
  imagePlaceholder?: string;
  imagePosition?: "left" | "right";
  stats?: Stat[];
  ctaText?: string;
  ctaHref?: string;
  ctaVariant?: "default" | "outline" | "secondary";
  showImageEffect?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * AboutSection Component
 *
 * A flexible two-column layout with image and content.
 * Perfect for "About Us", "Meet the Team", or "Guide" sections.
 *
 * @example Basic usage
 * <AboutSection
 *   badge="Meet Your Guide"
 *   paragraphs={["We understand...", "With 10 years..."]}
 *   image="/images/team.jpg"
 * />
 *
 * @example With stats and CTA
 * <AboutSection
 *   imagePosition="right"
 *   stats={[{ value: "10+", label: "Years" }]}
 *   ctaText="Learn More"
 *   ctaHref="/about"
 * />
 */
export function AboutSection({
  badge,
  heading,
  paragraphs = [
    "[EMPATHY: We understand what it's like to struggle with [problem]. You shouldn't have to figure this out alone.]",
    "[AUTHORITY: With [X years/clients/results], we've helped [type of customer] achieve [specific outcome].]",
  ],
  image,
  imageAlt = "About us",
  imagePlaceholder = "Team photo or founder headshot",
  imagePosition = "left",
  stats,
  ctaText,
  ctaHref = "/contact",
  ctaVariant = "default",
  showImageEffect = true,
  className,
  children,
}: AboutSectionProps) {
  const isImageLeft = imagePosition === "left";

  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto max-w-6xl px-4">
        <div
          className={cn(
            "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
            !isImageLeft && "lg:[&>*:first-child]:order-2"
          )}
        >
          {/* Image Column */}
          <div className="relative">
            {showImageEffect && (
              <>
                {/* Background layers for depth effect */}
                <div className="absolute -left-4 -top-4 h-full w-full rounded-2xl bg-muted/60" />
                <div className="absolute -left-2 -top-2 h-full w-full rounded-2xl bg-muted/40" />
              </>
            )}

            {/* Main image container */}
            <div
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl bg-muted",
                showImageEffect && "shadow-lg"
              )}
            >
              {image ? (
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                /* Placeholder */
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-muted-foreground">
                  <User className="h-16 w-16 opacity-40" />
                  <p className="text-center text-sm">[GUIDE IMAGE: {imagePlaceholder}]</p>
                </div>
              )}
            </div>
          </div>

          {/* Content Column */}
          <div>
            {/* Badge */}
            {badge && (
              <span className="mb-6 inline-block rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background">
                {badge}
              </span>
            )}

            {/* Heading */}
            {heading && (
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                {heading}
              </h2>
            )}

            {/* Paragraphs or Children */}
            {children || (
              <div className="space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* Inline Stats */}
            {stats && stats.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="rounded-lg border bg-background px-4 py-2 text-center"
                  >
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Button */}
            {ctaText && (
              <div className="mt-8">
                <Button asChild variant={ctaVariant} size="lg">
                  <Link href={ctaHref}>{ctaText}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
