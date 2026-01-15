import { AlertCircle, Frown, HelpCircle } from "lucide-react";

interface Problem {
  type: "external" | "internal" | "philosophical";
  icon?: React.ReactNode;
  title: string;
  description: string;
}

interface ProblemSectionProps {
  heading?: string;
  subheading?: string;
  problems?: Problem[];
}

/**
 * StoryBrand Problem Section
 *
 * Purpose: Agitate the pain they're experiencing
 *
 * Three types of problems in StoryBrand:
 * 1. External Problem - The tangible, surface-level issue
 * 2. Internal Problem - How it makes them FEEL (frustration, confusion, embarrassment)
 * 3. Philosophical Problem - Why this is just WRONG (optional but powerful)
 *
 * This section creates empathy and shows you understand their struggle.
 */
export function ProblemSection({
  heading = "Sound Familiar?",
  subheading = "[SUBHEADING: Acknowledge the struggle your customers face]",
  problems = [
    {
      type: "external",
      title: "[EXTERNAL PROBLEM]",
      description:
        "[Describe the tangible, surface-level problem. What's the practical issue they're dealing with every day?]",
    },
    {
      type: "internal",
      title: "[INTERNAL PROBLEM]",
      description:
        "[How does this problem make them FEEL? Frustrated? Overwhelmed? Embarrassed? Confused?]",
    },
    {
      type: "philosophical",
      title: "[PHILOSOPHICAL PROBLEM]",
      description:
        "[Why is this situation just WRONG? What should be different? Appeal to their sense of justice.]",
    },
  ],
}: ProblemSectionProps) {
  const getIcon = (type: Problem["type"], customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;

    switch (type) {
      case "external":
        return <AlertCircle className="h-8 w-8" />;
      case "internal":
        return <Frown className="h-8 w-8" />;
      case "philosophical":
        return <HelpCircle className="h-8 w-8" />;
      default:
        return <AlertCircle className="h-8 w-8" />;
    }
  };

  const getTypeLabel = (type: Problem["type"]) => {
    switch (type) {
      case "external":
        return "The Challenge";
      case "internal":
        return "The Frustration";
      case "philosophical":
        return "Why It Matters";
      default:
        return "";
    }
  };

  return (
    <section className="bg-muted py-16 md:py-24">
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

        {/* Problem cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-border/50 bg-background p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Type label */}
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {getTypeLabel(problem.type)}
              </span>

              {/* Icon */}
              <div className="mb-4 text-primary">
                {getIcon(problem.type, problem.icon)}
              </div>

              {/* Content */}
              <h3 className="mb-2 text-xl font-semibold">{problem.title}</h3>
              <p className="text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Empathy statement */}
        <div className="mx-auto mt-12 max-w-2xl text-center">
          <p className="text-lg italic text-muted-foreground">
            &ldquo;[EMPATHY STATEMENT: We understand how frustrating this
            is...]&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
