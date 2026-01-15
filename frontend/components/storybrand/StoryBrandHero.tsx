import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, Star } from "lucide-react";

interface StoryBrandHeroProps {
  headline?: string;
  subheadline?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  backgroundImage?: string;
}

/**
 * StoryBrand Hero Section
 *
 * Purpose: Pass the "grunt test" - visitor understands in 3 seconds:
 * 1. What you offer
 * 2. How it makes their life better
 * 3. How to get it
 *
 * The headline should focus on the CUSTOMER'S aspirational identity,
 * not your company. Position them as the hero.
 */
export function StoryBrandHero({
  headline = "[HEADLINE: Aspirational identity your customer wants]",
  subheadline = "[SUBHEADLINE: How you help them achieve that identity - keep it simple and clear]",
  primaryCta = { text: "Get a Free Quote", href: "/contact" },
  secondaryCta = { text: "Learn More", href: "#value-stack" },
  backgroundImage,
}: StoryBrandHeroProps) {
  return (
    <section
      className={`relative flex min-h-[90vh] items-center justify-center overflow-hidden ${
        backgroundImage ? "storybrand-hero-bg" : "bg-gradient-to-br from-background to-muted"
      }`}
      {...(backgroundImage && {
        style: { "--hero-bg-image": `url(${backgroundImage})` } as React.CSSProperties,
      })}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        {/* Main headline - Customer as hero */}
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>

        {/* Subheadline - How you help */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
          {subheadline}
        </p>

        {/* Dual CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Primary CTA - Direct action */}
          <Button asChild size="lg" className="min-w-[200px] text-lg">
            <Link href={primaryCta.href}>{primaryCta.text}</Link>
          </Button>

          {/* Secondary CTA - Transitional action */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="min-w-[200px] text-lg"
          >
            <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
          </Button>
        </div>

        {/* Social Proof - Trust Badge */}
        <div className="mt-12 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-4">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2">
              <div className="relative z-40 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-neutral-800">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="relative z-30 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-neutral-600">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="relative z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-neutral-400">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-neutral-300">
                <User className="h-4 w-4 text-neutral-600" />
              </div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-start">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                4.9k Reviews
              </span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">
            Trusted by 500+ businesses
          </span>
        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex h-14 w-8 items-start justify-center overflow-hidden rounded-full border-2 border-muted-foreground/50 p-2">
          <div className="h-2 w-2 animate-scroll-down rounded-full bg-muted-foreground/70" />
        </div>
      </div>
    </section>
  );
}
