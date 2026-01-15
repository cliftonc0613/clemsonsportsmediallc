/**
 * Static Pages Registry
 *
 * Registry of Next.js static pages that should be searchable.
 * These pages exist in the Next.js app but not in WordPress.
 */

import type { SearchResult } from "./wordpress";

export interface StaticPage {
  title: string;
  description: string;
  url: string;
  keywords?: string[]; // Additional searchable terms
}

/**
 * Static pages available for search.
 * Add new Next.js pages here to make them searchable.
 */
export const STATIC_PAGES: StaticPage[] = [
  {
    title: "Contact Us",
    description: "Get in touch with us. We'd love to hear from you and discuss how we can help your business grow.",
    url: "/contact",
    keywords: ["contact", "email", "phone", "reach", "message", "form"],
  },
  {
    title: "Testimonials",
    description: "Read what our clients have to say about working with us. Real stories from real businesses.",
    url: "/testimonials",
    keywords: ["reviews", "feedback", "clients", "testimonials", "stories"],
  },
  {
    title: "Our Services",
    description: "Explore our comprehensive range of services designed to help your business grow and succeed.",
    url: "/services",
    keywords: ["services", "offerings", "solutions", "what we do"],
  },
  {
    title: "About Us",
    description: "Learn more about our company, our mission, and the team behind our success.",
    url: "/about",
    keywords: ["about", "company", "team", "who we are", "mission"],
  },
  {
    title: "Privacy Policy",
    description: "Privacy Policy. Learn how we collect, use, and protect your personal information.",
    url: "/privacy-policy",
    keywords: ["privacy", "policy", "data", "gdpr", "cookies", "legal"],
  },
  {
    title: "Terms of Service",
    description: "Terms of Service. Read our terms and conditions for using our website and services.",
    url: "/terms-of-service",
    keywords: ["terms", "conditions", "legal", "agreement"],
  },
];

/**
 * Search static pages by query string.
 * Matches against title, description, and keywords.
 */
export function searchStaticPages(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();

  if (!q) return [];

  return STATIC_PAGES
    .filter(page =>
      page.title.toLowerCase().includes(q) ||
      page.description.toLowerCase().includes(q) ||
      page.keywords?.some(k => k.toLowerCase().includes(q))
    )
    .map((page, index) => ({
      id: index + 1000, // Offset to avoid ID conflicts with WordPress content
      type: "page" as const,
      title: page.title,
      excerpt: page.description,
      slug: page.url.replace(/^\//, ""),
      url: page.url,
    }));
}
