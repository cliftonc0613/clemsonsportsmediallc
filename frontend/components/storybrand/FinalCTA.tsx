import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

interface FinalCTAProps {
  heading?: string;
  subheading?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  showContactInfo?: boolean;
  phone?: string;
  email?: string;
}

/**
 * StoryBrand Final CTA Section
 *
 * Purpose: Close with a strong call to action
 *
 * This is your final chance to convert visitors.
 * The Final CTA should:
 * - Repeat your primary call to action
 * - Reinforce the transformation they'll experience
 * - Make it easy to take the next step
 *
 * This section mirrors the hero but with more urgency
 * since they've now seen all the value you offer.
 */
export function FinalCTA({
  heading = "Ready to Transform Your Business?",
  subheading = "[SUBHEADING: Reinforce the transformation. What does success look like? What are they saying 'yes' to?]",
  primaryCta = { text: "Get a Free Quote", href: "/contact" },
  secondaryCta = { text: "Schedule a Call", href: "/contact" },
  showContactInfo = true,
  phone = "[PHONE: (555) 123-4567]",
  email = "[EMAIL: hello@company.com]",
}: FinalCTAProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800" />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center text-white">
          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {heading}
          </h2>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90 md:text-xl">
            {subheading}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="group min-w-[200px] bg-white text-lg text-neutral-900 hover:bg-neutral-100"
            >
              <Link href={primaryCta.href}>
                {primaryCta.text}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[200px] border-white/40 text-lg text-white hover:bg-white/10 hover:border-white/60"
            >
              <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
            </Button>
          </div>

          {/* Contact info */}
          {showContactInfo && (
            <div className="mt-12 flex flex-col items-center justify-center gap-6 border-t border-white/20 pt-8 sm:flex-row">
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
              >
                <Phone className="h-5 w-5" />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
                <span>{email}</span>
              </a>
            </div>
          )}

          {/* Trust reminder */}
          <p className="mt-8 text-sm text-white/70">
            [TRUST STATEMENT: No obligation. Free consultation. Cancel anytime.]
          </p>
        </div>
      </div>
    </section>
  );
}
