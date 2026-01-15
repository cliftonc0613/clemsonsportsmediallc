import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface PlanStepsProps {
  heading?: string;
  subheading?: string;
  steps?: Step[];
  ctaText?: string;
  ctaHref?: string;
}

/**
 * StoryBrand Plan Section (3 Steps)
 *
 * Purpose: Make working with you feel SIMPLE
 *
 * Customers need a clear path forward. A confused mind says "no."
 * The plan section gives them a simple 3-step roadmap:
 *
 * 1. Step 1: Clear first action (what they DO)
 * 2. Step 2: What happens next (what YOU do)
 * 3. Step 3: The victory (what they GET)
 *
 * Even if your process is complex, simplify it to 3 steps.
 */
export function PlanSteps({
  heading = "How It Works",
  subheading = "[SUBHEADING: Getting started is simple - here's your path to success]",
  steps = [
    {
      number: 1,
      title: "[STEP 1: Action]",
      description:
        "[What do they DO first? Schedule a call? Fill out a form? Make it a clear, simple action they can take right now.]",
    },
    {
      number: 2,
      title: "[STEP 2: Process]",
      description:
        "[What happens NEXT? What do you do for them? Create their plan? Analyze their situation? Build their solution?]",
    },
    {
      number: 3,
      title: "[STEP 3: Victory]",
      description:
        "[What's the RESULT? The transformation? The success they achieve? Paint the picture of their win.]",
    },
  ],
  ctaText = "Get Started Today",
  ctaHref = "/contact",
}: PlanStepsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {subheading}
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-5xl">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary/50 via-primary to-primary/50 md:block" />

            {/* Step cards */}
            <div className="space-y-12 md:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col items-center gap-8 md:flex-row ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step number circle */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2">
                    {step.number}
                  </div>

                  {/* Content card */}
                  <div
                    className={`w-full rounded-2xl border border-border bg-card p-6 shadow-sm md:w-5/12 ${
                      index % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                    }`}
                  >
                    <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden w-5/12 md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="group text-lg">
            <Link href={ctaHref}>
              {ctaText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
