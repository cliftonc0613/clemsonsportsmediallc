import type { MetadataRoute } from "next";
import { getPosts, getServices, getPages, isWordPressConfigured } from "@/lib/wordpress";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // If WordPress isn't configured, return only static pages
  let posts: Awaited<ReturnType<typeof getPosts>> = [];
  let services: Awaited<ReturnType<typeof getServices>> = [];
  let pages: Awaited<ReturnType<typeof getPages>> = [];

  if (isWordPressConfigured()) {
    try {
      [posts, services, pages] = await Promise.all([
        getPosts({ per_page: 100 }),
        getServices({ per_page: 100 }),
        getPages({ per_page: 100 }),
      ]);
    } catch (error) {
      console.error('Failed to fetch WordPress content for sitemap:', error);
    }
  } else {
    console.warn('WORDPRESS_API_URL not set - sitemap will only contain static pages');
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/testimonials`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Blog posts - medium priority, updated monthly
  const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.modified),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Services - high priority, updated monthly
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${SITE_URL}/services/${service.slug}`,
    lastModified: new Date(service.modified),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // WordPress pages (excluding home and contact which are static)
  const wpPages: MetadataRoute.Sitemap = pages
    .filter((page) => !["home", "contact"].includes(page.slug))
    .map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: new Date(page.modified),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticPages, ...blogPosts, ...servicePages, ...wpPages];
}
