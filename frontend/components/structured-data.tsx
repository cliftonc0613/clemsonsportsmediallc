/**
 * Structured Data Components
 * Render JSON-LD schema scripts for SEO rich snippets
 *
 * These are Server Components - no "use client" directive needed.
 * JSON-LD scripts work correctly in Next.js App Router page components.
 *
 * @example
 * ```tsx
 * import { StructuredData } from "@/components/structured-data";
 * import { generateArticleSchema } from "@/lib/schema";
 *
 * export default function BlogPost({ post }) {
 *   const schema = generateArticleSchema(post, siteUrl);
 *   return (
 *     <>
 *       <StructuredData data={schema} />
 *       <article>...</article>
 *     </>
 *   );
 * }
 * ```
 */

import type { SchemaObject } from "@/lib/schema";

// =============================================================================
// Single Schema Component
// =============================================================================

interface StructuredDataProps {
  /** Schema.org JSON-LD object */
  data: SchemaObject | object;
}

/**
 * Render a single JSON-LD structured data script
 *
 * @example
 * ```tsx
 * <StructuredData data={generateOrganizationSchema(orgData)} />
 * ```
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

// =============================================================================
// Multiple Schemas Component
// =============================================================================

interface MultiStructuredDataProps {
  /** Array of Schema.org JSON-LD objects */
  schemas: (SchemaObject | object)[];
}

/**
 * Render multiple JSON-LD structured data scripts
 * Use for pages that need multiple schema types (e.g., Organization + Breadcrumb + Article)
 *
 * @example
 * ```tsx
 * <MultiStructuredData
 *   schemas={[
 *     generateOrganizationSchema(orgData),
 *     generateBreadcrumbSchema(breadcrumbs),
 *     generateArticleSchema(post, siteUrl),
 *   ]}
 * />
 * ```
 */
export function MultiStructuredData({ schemas }: MultiStructuredDataProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      ))}
    </>
  );
}

// =============================================================================
// Convenience Re-exports
// =============================================================================

// Re-export schema generators for convenient single import
export {
  generateOrganizationSchema,
  generateArticleSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateReviewSchema,
  combineSchemas,
} from "@/lib/schema";

export type {
  OrganizationData,
  BreadcrumbItem,
  FAQ,
  AuthorData,
  PublisherData,
  SchemaObject,
} from "@/lib/schema";
