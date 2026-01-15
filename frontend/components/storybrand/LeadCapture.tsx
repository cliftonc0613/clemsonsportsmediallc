"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gift, CheckCircle } from "lucide-react";

interface LeadCaptureProps {
  heading?: string;
  subheading?: string;
  offerTitle?: string;
  offerDescription?: string;
  benefits?: string[];
  buttonText?: string;
  successMessage?: string;
}

/**
 * StoryBrand Lead Capture / Lead Generator
 *
 * Purpose: Capture emails from visitors not ready to buy yet
 *
 * This is the "transitional call to action" - an easy first step
 * for people who aren't ready to commit but want to engage.
 *
 * Common lead magnets:
 * - Free consultation/call
 * - PDF guide or ebook
 * - Checklist or template
 * - Video training
 * - Free assessment
 *
 * The offer should solve a REAL problem to demonstrate value.
 */
export function LeadCapture({
  heading = "Not Ready to Commit?",
  subheading = "[SUBHEADING: Start with a free resource that helps you right now]",
  offerTitle = "[LEAD MAGNET: Free 15-Minute Strategy Call]",
  offerDescription = "[DESCRIPTION: Describe what they get and how it helps them. What problem does this free resource solve?]",
  benefits = [
    "[BENEFIT 1: What they'll learn or get]",
    "[BENEFIT 2: How it helps their situation]",
    "[BENEFIT 3: Why it's valuable]",
  ],
  buttonText = "Book Free Consultation",
  successMessage = "Thanks! We'll be in touch soon.",
}: LeadCaptureProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission - replace with actual form handling
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left side - Offer details */}
            <div className="p-8 text-primary-foreground md:p-12">
              <div className="mb-6 inline-flex rounded-full bg-white/20 p-3">
                <Gift className="h-8 w-8" />
              </div>

              <h2 className="mb-2 text-3xl font-bold">{heading}</h2>
              <p className="mb-6 text-lg opacity-90">{subheading}</p>

              <h3 className="mb-4 text-xl font-semibold">{offerTitle}</h3>
              <p className="mb-6 opacity-90">{offerDescription}</p>

              {/* Benefits list */}
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-white/80" />
                    <span className="opacity-90">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side - Form */}
            <div className="flex items-center bg-background p-8 md:p-12">
              {isSubmitted ? (
                <div className="w-full text-center">
                  <div className="mb-4 inline-flex rounded-full bg-green-100 p-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{successMessage}</h3>
                  <p className="text-muted-foreground">
                    Check your inbox for next steps.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div>
                    <label
                      htmlFor="lead-name"
                      className="mb-2 block text-sm font-medium"
                    >
                      Your Name
                    </label>
                    <Input
                      id="lead-name"
                      type="text"
                      placeholder="John Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lead-email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email Address
                    </label>
                    <Input
                      id="lead-email"
                      type="email"
                      placeholder="john@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : buttonText}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
