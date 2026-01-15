interface ExplanatoryParagraphProps {
  problem?: string;
  solution?: string;
  success?: string;
}

/**
 * StoryBrand Explanatory Paragraph
 *
 * Purpose: Full problem-solution-success narrative in one concise paragraph
 *
 * This section distills your entire value proposition into a single,
 * powerful paragraph that follows the structure:
 *
 * [PROBLEM] → [SOLUTION] → [SUCCESS]
 *
 * Example: "Many small business owners struggle to attract consistent leads
 * online. We create conversion-focused websites that turn visitors into
 * customers. The result? A steady stream of qualified leads that grow
 * your business."
 */
export function ExplanatoryParagraph({
  problem = "[PROBLEM: Describe the challenge your ideal customer faces. What's holding them back? What are they struggling with?]",
  solution = "[SOLUTION: How do you solve that problem? What do you offer that addresses their pain point?]",
  success = "[SUCCESS: What does life look like after working with you? What transformation do they experience?]",
}: ExplanatoryParagraphProps) {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Decorative quote marks */}
          <div className="relative">
            <span className="absolute -left-4 -top-8 text-8xl font-serif text-primary/10">
              &ldquo;
            </span>

            {/* The explanatory paragraph */}
            <div className="relative rounded-2xl border border-border bg-background p-8 shadow-sm md:p-12">
              <p className="text-xl leading-relaxed text-foreground md:text-2xl">
                <span className="text-muted-foreground">{problem}</span>{" "}
                <span className="font-medium text-foreground">{solution}</span>{" "}
                <span className="font-semibold text-primary">{success}</span>
              </p>
            </div>

            <span className="absolute -bottom-8 -right-4 text-8xl font-serif text-primary/10">
              &rdquo;
            </span>
          </div>

          {/* Helper text for template users */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              <strong>Tip:</strong> This paragraph should be concise (2-3
              sentences max) and follow the Problem → Solution → Success
              structure.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
