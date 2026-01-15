import Link from "next/link";
import { getTestimonials, getPosts, isWordPressConfigured } from "@/lib/wordpress";
import type { WPTestimonial, WPPost } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { OrganizationSchema } from "@/components/JsonLd";
import { BlogCard } from "@/components/BlogCard";
import { BodyClass } from "@/components/BodyClass";

// StoryBrand Components
import {
  StoryBrandHero,
  ProblemSection,
  ValueStack,
  GuideSection,
  PlanSteps,
  ExplanatoryParagraph,
  LeadCapture,
  StakesSection,
  SocialProof,
  FinalCTA,
} from "@/components/storybrand";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

// Enable ISR with 5 second revalidation
export const revalidate = 5;

/**
 * StoryBrand Homepage
 *
 * This homepage follows the StoryBrand 7-part framework by Donald Miller.
 * The structure positions your CUSTOMER as the hero, and your BRAND as the guide.
 *
 * Section Order:
 * 1. Hero - Pass the "grunt test" (what you offer, how it helps, how to get it)
 * 2. Problem - Agitate the pain points (external, internal, philosophical)
 * 3. Value Stack - Show the benefits/transformation (or use WordPress Services)
 * 4. Guide - Position your brand as the trusted guide (empathy + authority)
 * 5. Plan - 3 simple steps to success
 * 6. Explanatory Paragraph - Problem → Solution → Success narrative
 * 7. Lead Capture - Free consultation/resource for those not ready to buy
 * 8. Stakes - What happens if they don't act
 * 9. Social Proof - Testimonials and client logos (WordPress Testimonials)
 * 10. Blog - Optional content section (WordPress Posts)
 * 11. Final CTA - Close with strong call to action
 *
 * To customize: Replace [PLACEHOLDER] text in each component with real content.
 */
export default async function HomePage() {
  // Fetch data from WordPress with graceful fallback
  let testimonials: WPTestimonial[] = [];
  let posts: WPPost[] = [];

  if (isWordPressConfigured()) {
    try {
      [testimonials, posts] = await Promise.all([
        getTestimonials({ per_page: 3 }),
        getPosts({ per_page: 3 }),
      ]);
    } catch (error) {
      console.error('Failed to fetch WordPress content:', error);
    }
  }

  return (
    <>
      <BodyClass className="page-home" />

      {/* Organization Schema for SEO */}
      <OrganizationSchema
        name={SITE_NAME}
        url={SITE_URL}
        description="We help service-based businesses grow with modern, fast, and beautiful websites powered by headless WordPress and Next.js."
        sameAs={[
          // Add your social media URLs here
          // "https://twitter.com/yourcompany",
          // "https://linkedin.com/company/yourcompany",
        ]}
      />

      {/* ============================================
          SECTION 1: HERO
          Pass the "grunt test" - 3 seconds to understand:
          - What you offer
          - How it makes their life better
          - How to get it
          ============================================ */}
      <StoryBrandHero
        headline="[HEADLINE: Aspirational identity your customer wants]"
        subheadline="[SUBHEADLINE: How you help them achieve that identity - keep it simple and clear]"
        primaryCta={{ text: "Get a Free Quote", href: "/contact" }}
        secondaryCta={{ text: "Learn More", href: "#value-stack" }}
      />

      {/* ============================================
          SECTION 2: PROBLEM
          Agitate the pain - show you understand their struggle
          ============================================ */}
      <ProblemSection
        heading="Sound Familiar?"
        subheading="[SUBHEADING: Acknowledge the struggle your customers face]"
        problems={[
          {
            type: "external",
            title: "[EXTERNAL PROBLEM]",
            description: "[Describe the tangible, surface-level problem they deal with every day]",
          },
          {
            type: "internal",
            title: "[INTERNAL PROBLEM]",
            description: "[How does this problem make them FEEL? Frustrated? Overwhelmed? Embarrassed?]",
          },
          {
            type: "philosophical",
            title: "[PHILOSOPHICAL PROBLEM]",
            description: "[Why is this situation just WRONG? Appeal to their sense of justice]",
          },
        ]}
      />

      {/* ============================================
          SECTION 3: VALUE STACK
          Show the transformation/benefits they'll experience
          Can be replaced with WordPress Services for dynamic content
          ============================================ */}
      <ValueStack
        heading="What You Get"
        subheading="[SUBHEADING: The transformation and results your customers can expect]"
        values={[
          {
            title: "[VALUE 1: Quick Win]",
            description: "[Focus on the OUTCOME they get, not the feature you provide]",
          },
          {
            title: "[VALUE 2: Core Benefit]",
            description: "[What problem does this solve? What pain does it eliminate?]",
          },
          {
            title: "[VALUE 3: Ultimate Result]",
            description: "[What's the aspirational outcome? What does success look like?]",
          },
        ]}
      />

      {/* ============================================
          SECTION 4: GUIDE
          Position your brand as the trusted guide
          ============================================ */}
      <GuideSection
        empathyStatement="[EMPATHY: We understand what it's like to struggle with [problem]. You shouldn't have to figure this out alone.]"
        authorityStatement="[AUTHORITY: With [X years/clients/results], we've helped [type of customer] achieve [specific outcome].]"
        authorityMarkers={[
          { stat: "[X]+", label: "Years Experience" },
          { stat: "[X]+", label: "Happy Clients" },
          { stat: "[X]%", label: "Success Rate" },
        ]}
      />

      {/* ============================================
          SECTION 5: THE PLAN
          Make working with you feel simple - 3 steps
          ============================================ */}
      <PlanSteps
        heading="How It Works"
        subheading="[SUBHEADING: Getting started is simple]"
        steps={[
          {
            number: 1,
            title: "[STEP 1: Action]",
            description: "[What do they DO first? Schedule a call? Fill out a form?]",
          },
          {
            number: 2,
            title: "[STEP 2: Process]",
            description: "[What happens NEXT? What do you do for them?]",
          },
          {
            number: 3,
            title: "[STEP 3: Victory]",
            description: "[What's the RESULT? The success they achieve?]",
          },
        ]}
        ctaText="Get Started Today"
        ctaHref="/contact"
      />

      {/* ============================================
          SECTION 6: EXPLANATORY PARAGRAPH
          Problem → Solution → Success in one paragraph
          ============================================ */}
      <ExplanatoryParagraph
        problem="[PROBLEM: Describe the challenge your ideal customer faces]"
        solution="[SOLUTION: How do you solve that problem?]"
        success="[SUCCESS: What does life look like after working with you?]"
      />

      {/* ============================================
          SECTION 7: LEAD CAPTURE
          Transitional CTA for those not ready to buy
          ============================================ */}
      <LeadCapture
        heading="Not Ready to Commit?"
        subheading="[Start with a free resource that helps you right now]"
        offerTitle="[LEAD MAGNET: Free 15-Minute Strategy Call]"
        offerDescription="[What they get and how it helps them]"
        benefits={[
          "[BENEFIT 1: What they'll learn or get]",
          "[BENEFIT 2: How it helps their situation]",
          "[BENEFIT 3: Why it's valuable]",
        ]}
        buttonText="Book Free Consultation"
      />

      {/* ============================================
          SECTION 8: STAKES
          What happens if they don't act
          ============================================ */}
      <StakesSection
        heading="What Happens If You Wait?"
        subheading="[The cost of staying where you are]"
        items={[
          {
            title: "[STAKE 1: Lost Opportunity]",
            description: "[What opportunity are they missing by not acting?]",
          },
          {
            title: "[STAKE 2: Wasted Time]",
            description: "[How is their current approach wasting time?]",
          },
          {
            title: "[STAKE 3: Growing Problem]",
            description: "[How does this problem get worse over time?]",
          },
        ]}
        ctaText="Don't Wait - Get Started"
        ctaHref="/contact"
      />

      {/* ============================================
          SECTION 9: SOCIAL PROOF
          Testimonials and trust markers (WordPress Testimonials)
          ============================================ */}
      <SocialProof
        heading="Trusted by Businesses Like Yours"
        subheading="[See what our clients have to say]"
        testimonials={testimonials}
        stats={[
          { value: "[X]+", label: "Happy Clients" },
          { value: "[X]%", label: "Success Rate" },
          { value: "[X]+", label: "Projects Completed" },
        ]}
      />

      {/* ============================================
          SECTION 10: BLOG (Optional)
          Content marketing / SEO section (WordPress Posts)
          ============================================ */}
      {posts.length > 0 && (
        <section className="bg-muted/50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Latest from the Blog
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Insights and updates from our team
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/blog">View All Posts</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================
          SECTION 11: FINAL CTA
          Close with a strong call to action
          ============================================ */}
      <FinalCTA
        heading="Ready to Transform Your Business?"
        subheading="[Reinforce the transformation. What are they saying 'yes' to?]"
        primaryCta={{ text: "Get a Free Quote", href: "/contact" }}
        secondaryCta={{ text: "Schedule a Call", href: "/contact" }}
        phone="[PHONE: (555) 123-4567]"
        email="[EMAIL: hello@company.com]"
      />
    </>
  );
}
