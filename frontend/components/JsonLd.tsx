/**
 * JSON-LD Structured Data Components
 * Provides schema.org markup for better SEO and rich snippets
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
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

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  sameAs,
  contactPoint,
  address,
}: OrganizationSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
  };

  if (logo) data.logo = logo;
  if (description) data.description = description;
  if (sameAs && sameAs.length > 0) data.sameAs = sameAs;

  if (contactPoint) {
    data.contactPoint = {
      "@type": "ContactPoint",
      ...contactPoint,
    };
  }

  if (address) {
    data.address = {
      "@type": "PostalAddress",
      ...address,
    };
  }

  return <JsonLd data={data} />;
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  url: string;
  provider: {
    name: string;
    url: string;
  };
  image?: string;
  areaServed?: string;
  serviceType?: string;
}

export function ServiceSchema({
  name,
  description,
  url,
  provider,
  image,
  areaServed,
  serviceType,
}: ServiceSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "Organization",
      ...provider,
    },
  };

  if (image) data.image = image;
  if (areaServed) data.areaServed = areaServed;
  if (serviceType) data.serviceType = serviceType;

  return <JsonLd data={data} />;
}

interface BlogPostingSchemaProps {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
}

export function BlogPostingSchema({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  publisher,
}: BlogPostingSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline,
    description,
    url,
    datePublished,
    dateModified,
    author: {
      "@type": "Person",
      name: author.name,
      ...(author.url && { url: author.url }),
    },
    publisher: {
      "@type": "Organization",
      name: publisher.name,
      ...(publisher.logo && {
        logo: {
          "@type": "ImageObject",
          url: publisher.logo,
        },
      }),
    },
  };

  if (image) {
    data.image = {
      "@type": "ImageObject",
      url: image,
    };
  }

  return <JsonLd data={data} />;
}

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

interface FAQSchemaProps {
  questions: {
    question: string;
    answer: string;
  }[];
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

interface LocalBusinessSchemaProps {
  name: string;
  url: string;
  image?: string;
  description?: string;
  telephone?: string;
  email?: string;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}

export function LocalBusinessSchema({
  name,
  url,
  image,
  description,
  telephone,
  email,
  address,
  geo,
  openingHours,
  priceRange,
}: LocalBusinessSchemaProps) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    url,
  };

  if (image) data.image = image;
  if (description) data.description = description;
  if (telephone) data.telephone = telephone;
  if (email) data.email = email;
  if (priceRange) data.priceRange = priceRange;
  if (openingHours) data.openingHoursSpecification = openingHours;

  if (address) {
    data.address = {
      "@type": "PostalAddress",
      ...address,
    };
  }

  if (geo) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude,
    };
  }

  return <JsonLd data={data} />;
}
