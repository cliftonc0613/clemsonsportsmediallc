import { CheckCircle, Zap, Shield } from "lucide-react";

interface ValueItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface ValueStackProps {
  heading?: string;
  subheading?: string;
  values?: ValueItem[];
}

/**
 * StoryBrand Value Stack
 *
 * Purpose: Show the quick wins they'll experience
 *
 * The value stack presents 3 key benefits that directly address
 * the problems outlined in the Problem Section. Each benefit
 * should be outcome-focused (what they GET, not what you DO).
 *
 * This can be replaced with WordPress Services if you prefer
 * dynamic content over static placeholders.
 */
export function ValueStack({
  heading = "What You Get",
  subheading = "[SUBHEADING: The transformation and results your customers can expect]",
  values = [
    {
      icon: <Zap className="h-10 w-10" />,
      title: "[VALUE 1: Quick Win]",
      description:
        "[Describe the first key benefit. Focus on the OUTCOME they get, not the feature you provide. How does their life improve?]",
    },
    {
      icon: <Shield className="h-10 w-10" />,
      title: "[VALUE 2: Core Benefit]",
      description:
        "[Describe the second key benefit. What problem does this solve? What pain does it eliminate?]",
    },
    {
      icon: <CheckCircle className="h-10 w-10" />,
      title: "[VALUE 3: Ultimate Result]",
      description:
        "[Describe the third key benefit. What's the aspirational outcome? What does success look like?]",
    },
  ],
}: ValueStackProps) {
  return (
    <section id="value-stack" className="py-16 md:py-24">
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

        {/* Value cards */}
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Content */}
              <div className="relative">
                {/* Icon */}
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary">
                  {value.icon || <CheckCircle className="h-10 w-10" />}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold">{value.title}</h3>

                {/* Description */}
                <p className="text-muted-foreground">{value.description}</p>
              </div>

              {/* Number indicator */}
              <div className="absolute -right-4 -top-4 text-8xl font-bold text-primary/5">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
