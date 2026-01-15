import Image from "next/image";
import { Star } from "lucide-react";
import type { WPTestimonial } from "@/lib/wordpress";

interface Logo {
  src: string;
  alt: string;
  href?: string;
}

interface SocialProofProps {
  heading?: string;
  subheading?: string;
  testimonials?: WPTestimonial[];
  logos?: Logo[];
  stats?: {
    value: string;
    label: string;
  }[];
}

/**
 * StoryBrand Social Proof Section
 *
 * Purpose: Build trust through others' success
 *
 * Social proof reduces risk in the customer's mind.
 * Include:
 * - Testimonials (real quotes from real people)
 * - Client logos (recognizable brands if possible)
 * - Statistics (numbers that demonstrate success)
 *
 * This section integrates with WordPress Testimonials CPT
 * for dynamic content, or falls back to placeholders.
 */
export function SocialProof({
  heading = "Trusted by Businesses Like Yours",
  subheading = "[SUBHEADING: See what our clients have to say]",
  testimonials = [],
  logos = [
    { src: "", alt: "[CLIENT LOGO 1]" },
    { src: "", alt: "[CLIENT LOGO 2]" },
    { src: "", alt: "[CLIENT LOGO 3]" },
    { src: "", alt: "[CLIENT LOGO 4]" },
    { src: "", alt: "[CLIENT LOGO 5]" },
  ],
  stats = [
    { value: "[X]+", label: "Happy Clients" },
    { value: "[X]%", label: "Success Rate" },
    { value: "[X]+", label: "Projects Completed" },
  ],
}: SocialProofProps) {
  // Default placeholder testimonials if none provided
  const displayTestimonials =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 1,
            acf: {
              client_name: "[CLIENT NAME]",
              company: "[Company Name]",
              quote:
                "[TESTIMONIAL: Include a specific, results-focused quote. 'Before working with [company], we struggled with [problem]. Now we [specific result].' The best testimonials mention specific outcomes.]",
              rating: 5,
            },
          },
          {
            id: 2,
            acf: {
              client_name: "[CLIENT NAME]",
              company: "[Company Name]",
              quote:
                "[TESTIMONIAL: Another client success story. Focus on the transformation - what was before, what is now, and how their life/business improved.]",
              rating: 5,
            },
          },
          {
            id: 3,
            acf: {
              client_name: "[CLIENT NAME]",
              company: "[Company Name]",
              quote:
                "[TESTIMONIAL: Highlight a different aspect of your service. Speed? Quality? Communication? Results? Let clients speak to your strengths.]",
              rating: 5,
            },
          },
        ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-16 grid grid-cols-3 gap-8 border-y border-border py-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="mx-auto mb-16 grid max-w-6xl gap-8 md:grid-cols-3">
          {displayTestimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.acf?.rating || 5 }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  )
                )}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-foreground">
                &ldquo;{testimonial.acf?.quote}&rdquo;
              </blockquote>

              {/* Client info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                  {testimonial.acf?.client_name?.charAt(0) || "C"}
                </div>
                <div>
                  <div className="font-medium">
                    {testimonial.acf?.client_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.acf?.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client logos */}
        <div className="border-t border-border pt-12">
          <p className="mb-8 text-center text-sm text-muted-foreground">
            Trusted by leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo, index) =>
              logo.src ? (
                <div key={index} className="relative h-8 w-24 opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    fill
                    sizes="96px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div
                  key={index}
                  className="flex h-10 w-28 items-center justify-center rounded border border-dashed border-border text-xs text-muted-foreground"
                >
                  {logo.alt}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
