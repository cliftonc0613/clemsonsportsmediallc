import type { Metadata } from "next";
import Link from "next/link";
import { getTestimonials, isWordPressConfigured } from "@/lib/wordpress";
import type { WPTestimonial } from "@/lib/wordpress";
import { Hero } from "@/components/Hero";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { BodyClass } from "@/components/BodyClass";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what our clients have to say about working with us. Real stories from real businesses.",
};

// Enable ISR with 5 second revalidation
export const revalidate = 5;

// Value Block Component
function ValueBlock({
  badge,
  heading,
  description,
}: {
  badge: string;
  heading: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-center p-6">
      <span className="mb-4 inline-block w-fit rounded-full bg-neutral-100 px-4 py-1.5 text-sm font-medium text-neutral-700">
        {badge}
      </span>
      <h3 className="text-2xl font-bold text-neutral-900">{heading}</h3>
      <p className="mt-3 leading-relaxed text-neutral-600">{description}</p>
    </div>
  );
}

// Helper function to strip HTML tags from content
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')  // Replace <br> with space
    .replace(/<[^>]*>/g, '')        // Remove all other HTML tags
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim();
}

// Featured Testimonial Component
function FeaturedTestimonial({ testimonial }: { testimonial: WPTestimonial }) {
  const clientName =
    testimonial.acf?.client_name || testimonial.title.rendered;
  const company = testimonial.acf?.company;
  const rawQuote = testimonial.acf?.quote;
  const quote = rawQuote ? stripHtml(rawQuote) : null;
  const rating = testimonial.acf?.rating || 5;

  // Get initials
  const parts = clientName.trim().split(/\s+/);
  const initials =
    parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : clientName.slice(0, 2).toUpperCase();

  return (
    <div className="rounded-2xl bg-neutral-50 p-8 md:p-12">
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <span className="mb-6 inline-block rounded-full bg-neutral-200 px-4 py-1.5 text-sm font-medium text-neutral-700">
          Client Success Story
        </span>

        {/* Stars */}
        <div className="mb-6 flex justify-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "fill-neutral-200 text-neutral-200"}`}
            />
          ))}
        </div>

        {/* Quote */}
        {quote && (
          <blockquote className="text-xl leading-relaxed text-neutral-800 md:text-2xl">
            &ldquo;{quote}&rdquo;
          </blockquote>
        )}

        {/* Author */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-300 text-sm font-semibold text-neutral-700">
            {initials}
          </div>
          <div className="text-left">
            <p className="font-semibold text-neutral-900">{clientName}</p>
            {company && <p className="text-sm text-neutral-500">{company}</p>}
          </div>
        </div>

        {/* Bottom heading */}
        <div className="mt-10">
          <h3 className="text-xl font-bold text-neutral-900">
            Outstanding Results
          </h3>
          <p className="mt-2 text-neutral-600">
            Delivering exceptional services that exceed expectations every time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function TestimonialsPage() {
  let testimonials: WPTestimonial[] = [];

  if (isWordPressConfigured()) {
    try {
      testimonials = await getTestimonials({ per_page: 100 });
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    }
  }

  // Get featured testimonial (last one) and regular testimonials
  const featuredTestimonial =
    testimonials.length > 2 ? testimonials[testimonials.length - 1] : null;
  const regularTestimonials = featuredTestimonial
    ? testimonials.slice(0, -1)
    : testimonials;

  return (
    <>
      <BodyClass className="page-testimonials" />

      <Hero
        title="Client Testimonials"
        subtitle="Don't just take our word for it. Here's what our clients have to say about their experience working with us."
        size="default"
      />

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1100px] px-4">
          {testimonials.length > 0 ? (
            <div className="space-y-8">
              {/* Bento Grid Layout */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Row 1: Wide testimonial + Value block */}
                {regularTestimonials[0] && (
                  <div className="md:col-span-1">
                    <TestimonialCard testimonial={regularTestimonials[0]} />
                  </div>
                )}
                <ValueBlock
                  badge="Quality Assurance"
                  heading="Trusted by Businesses"
                  description="Our commitment to excellence and attention to detail has earned us the trust of customers throughout the region."
                />

                {/* Row 2: Value block + Testimonial */}
                <ValueBlock
                  badge="Professional Service"
                  heading="Professional Excellence"
                  description="Every project is completed with the highest standards of quality and professionalism that our customers expect."
                />
                {regularTestimonials[1] && (
                  <div className="md:col-span-1">
                    <TestimonialCard testimonial={regularTestimonials[1]} />
                  </div>
                )}
              </div>

              {/* Featured Testimonial */}
              {featuredTestimonial && (
                <FeaturedTestimonial testimonial={featuredTestimonial} />
              )}

              {/* Additional testimonials in grid */}
              {regularTestimonials.length > 2 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {regularTestimonials.slice(2).map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-neutral-500">
                No testimonials yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-100 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            Ready to Be Our Next Success Story?
          </h2>
          <p className="mt-4 text-lg text-neutral-600">
            Join our growing list of satisfied clients. Let&apos;s discuss how
            we can help your business thrive.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/contact">Start Your Journey</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
