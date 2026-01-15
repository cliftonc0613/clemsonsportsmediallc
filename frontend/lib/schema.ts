/**
 * Schema.org Structured Data Generators
 * Generate JSON-LD schema objects for rich snippets in search results
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import type { WPPost, WPService, WPTestimonial } from "./wordpress";

// =============================================================================
// TypeScript Interfaces
// =============================================================================

/**
 * Organization data for Schema.org Organization type
 */
export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  /** Social media profile URLs */
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

/**
 * Breadcrumb navigation item
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * FAQ question and answer pair
 */
export interface FAQ {
  question: string;
  answer: string;
}

/**
 * Article author data
 */
export interface AuthorData {
  name: string;
  url?: string;
}

/**
 * Publisher/Organization data for articles
 */
export interface PublisherData {
  name: string;
  url?: string;
  logo?: string;
}

// =============================================================================
// Schema.org Types
// =============================================================================

export type SchemaType =
  | "Organization"
  | "LocalBusiness"
  | "Article"
  | "BlogPosting"
  | "Service"
  | "BreadcrumbList"
  | "FAQPage"
  | "Review";

export interface SchemaObject {
  "@context": "https://schema.org";
  "@type": SchemaType | string;
  [key: string]: unknown;
}

// =============================================================================
// Schema Generator Functions
// =============================================================================

/**
 * Generate Organization schema for company/business information
 *
 * @example
 * ```ts
 * const schema = generateOrganizationSchema({
 *   name: "Acme Corp",
 *   url: "https://acme.com",
 *   logo: "https://acme.com/logo.png",
 *   sameAs: ["https://twitter.com/acme", "https://linkedin.com/company/acme"],
 * });
 * ```
 */
export function generateOrganizationSchema(
  data: OrganizationData
): SchemaObject {
  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: data.name,
    url: data.url,
  };

  if (data.logo) {
    schema.logo = {
      "@type": "ImageObject",
      url: data.logo,
    };
  }

  if (data.description) {
    schema.description = data.description;
  }

  if (data.sameAs && data.sameAs.length > 0) {
    schema.sameAs = data.sameAs;
  }

  if (data.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      ...(data.contactPoint.telephone && {
        telephone: data.contactPoint.telephone,
      }),
      ...(data.contactPoint.email && { email: data.contactPoint.email }),
      ...(data.contactPoint.contactType && {
        contactType: data.contactPoint.contactType,
      }),
    };
  }

  if (data.address) {
    schema.address = {
      "@type": "PostalAddress",
      ...data.address,
    };
  }

  return schema;
}

/**
 * Generate Article/BlogPosting schema for blog posts and articles
 *
 * @example
 * ```ts
 * const schema = generateArticleSchema(post, "https://example.com");
 * ```
 */
export function generateArticleSchema(
  post: WPPost,
  siteUrl: string,
  options?: {
    author?: AuthorData;
    publisher?: PublisherData;
    type?: "Article" | "BlogPosting";
  }
): SchemaObject {
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const title = post.title.rendered.replace(/<[^>]*>/g, "");
  const description = post.excerpt.rendered
    .replace(/<[^>]*>/g, "")
    .slice(0, 160);

  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": options?.type || "BlogPosting",
    headline: title,
    description,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };

  // Author
  const authorName = options?.author?.name || post.author_name || "Unknown";
  schema.author = {
    "@type": "Person",
    name: authorName,
    ...(options?.author?.url && { url: options.author.url }),
  };

  // Publisher
  if (options?.publisher) {
    schema.publisher = {
      "@type": "Organization",
      name: options.publisher.name,
      ...(options.publisher.url && { url: options.publisher.url }),
      ...(options.publisher.logo && {
        logo: {
          "@type": "ImageObject",
          url: options.publisher.logo,
        },
      }),
    };
  }

  // Featured image
  if (post.featured_image_url) {
    schema.image = {
      "@type": "ImageObject",
      url: post.featured_image_url,
    };
  }

  return schema;
}

/**
 * Generate Service schema for service offerings
 *
 * @example
 * ```ts
 * const schema = generateServiceSchema(service, "https://example.com", {
 *   provider: { name: "Acme Corp", url: "https://acme.com" }
 * });
 * ```
 */
export function generateServiceSchema(
  service: WPService,
  siteUrl: string,
  options?: {
    provider?: {
      name: string;
      url: string;
    };
    areaServed?: string;
  }
): SchemaObject {
  const serviceUrl = `${siteUrl}/services/${service.slug}`;
  const title = service.title.rendered.replace(/<[^>]*>/g, "");
  const description = (service.excerpt.rendered || service.content.rendered)
    .replace(/<[^>]*>/g, "")
    .slice(0, 300);

  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    url: serviceUrl,
  };

  if (options?.provider) {
    schema.provider = {
      "@type": "Organization",
      name: options.provider.name,
      url: options.provider.url,
    };
  }

  if (options?.areaServed) {
    schema.areaServed = options.areaServed;
  }

  if (service.featured_image_url) {
    schema.image = service.featured_image_url;
  }

  // Add pricing if available from ACF
  if (service.acf?.pricing) {
    schema.offers = {
      "@type": "Offer",
      price: service.acf.pricing,
      priceCurrency: "USD",
    };
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema for navigation trails
 *
 * @example
 * ```ts
 * const schema = generateBreadcrumbSchema([
 *   { name: "Home", url: "https://example.com" },
 *   { name: "Blog", url: "https://example.com/blog" },
 *   { name: "Post Title", url: "https://example.com/blog/post-slug" },
 * ]);
 * ```
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQPage schema for FAQ sections
 *
 * @example
 * ```ts
 * const schema = generateFAQSchema([
 *   { question: "What is your return policy?", answer: "30-day money-back guarantee." },
 *   { question: "Do you ship internationally?", answer: "Yes, we ship worldwide." },
 * ]);
 * ```
 */
export function generateFAQSchema(faqs: FAQ[]): SchemaObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Review schema for testimonials
 *
 * @example
 * ```ts
 * const schema = generateReviewSchema(testimonial, {
 *   itemReviewed: { name: "Web Development Service", url: "https://example.com/services/web-dev" }
 * });
 * ```
 */
export function generateReviewSchema(
  testimonial: WPTestimonial,
  options?: {
    itemReviewed?: {
      name: string;
      url?: string;
    };
  }
): SchemaObject {
  const acf = testimonial.acf;
  const authorName = acf?.client_name || testimonial.title.rendered.replace(/<[^>]*>/g, "");
  const reviewText = acf?.quote || "";
  const rating = acf?.rating;

  const schema: SchemaObject = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: {
      "@type": "Person",
      name: authorName,
    },
    reviewBody: reviewText,
    datePublished: testimonial.date,
  };

  // Add rating if available
  if (rating && rating > 0) {
    schema.reviewRating = {
      "@type": "Rating",
      ratingValue: rating,
      bestRating: 5,
      worstRating: 1,
    };
  }

  // Add item being reviewed
  if (options?.itemReviewed) {
    schema.itemReviewed = {
      "@type": "Service",
      name: options.itemReviewed.name,
      ...(options.itemReviewed.url && { url: options.itemReviewed.url }),
    };
  } else if (acf?.related_service) {
    // Use related service from ACF if available
    const relatedService = acf.related_service;
    schema.itemReviewed = {
      "@type": "Service",
      name: relatedService.title?.rendered?.replace(/<[^>]*>/g, "") || "Service",
    };
  }

  // Add company info if available
  if (acf?.company) {
    (schema.author as Record<string, unknown>).worksFor = {
      "@type": "Organization",
      name: acf.company,
    };
  }

  return schema;
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Combine multiple schemas into an array for pages with multiple schema types
 *
 * @example
 * ```ts
 * const schemas = combineSchemas(
 *   generateOrganizationSchema(orgData),
 *   generateBreadcrumbSchema(breadcrumbs),
 *   generateArticleSchema(post, siteUrl)
 * );
 * ```
 */
export function combineSchemas(...schemas: SchemaObject[]): SchemaObject[] {
  return schemas;
}
