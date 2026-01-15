# Headless WordPress Tooling Guide

A comprehensive reference for building headless CMS websites using WordPress as the backend. This guide covers the complete tooling stack for business websites with blog posts, portfolios, services, and custom post types.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [WordPress Backend Setup](#wordpress-backend-setup)
3. [API Options: WPGraphQL vs REST](#api-options-wpgraphql-vs-rest)
4. [Frontend Framework Options](#frontend-framework-options)
5. [Real-Time Preview Setup](#real-time-preview-setup)
6. [Custom Post Types & ACF](#custom-post-types--acf)
7. [Hosting & Deployment](#hosting--deployment)
8. [Starter Templates](#starter-templates)
9. [Alternative CMS Options](#alternative-cms-options)
10. [Implementation Checklist](#implementation-checklist)

---

## Architecture Overview

### What is Headless WordPress?

Headless WordPress uses WordPress solely for backend content management while a separate system (like Next.js) handles the frontend presentation. WordPress exposes content via API, and the frontend consumes that API to render pages.

```
┌─────────────────────┐     API (GraphQL/REST)     ┌─────────────────────┐
│   WordPress CMS     │ ◄──────────────────────────► │   Next.js Frontend  │
│   (Content Engine)  │                              │   (Presentation)    │
└─────────────────────┘                              └─────────────────────┘
         │                                                     │
         ▼                                                     ▼
   Managed WP Host                                    Vercel / Netlify
   (Kinsta, WP Engine)                               (Edge Deployment)
```

### Benefits

- **Performance**: Static generation + CDN = sub-second load times
- **Security**: WordPress admin separate from public-facing site
- **Flexibility**: Use any frontend technology
- **Scalability**: Frontend scales independently from backend
- **Developer Experience**: Modern JavaScript tooling and workflows

---

## WordPress Backend Setup

### Core Requirements

- WordPress 4.7+ (REST API built-in)
- PHP 8.0+ recommended
- Secure, high-performance hosting

### Essential Plugins

| Plugin | Purpose | Required |
|--------|---------|----------|
| **WPGraphQL** | GraphQL API for WordPress | Yes |
| **Advanced Custom Fields (ACF) Pro** | Custom fields for structured content | Yes |
| **WPGraphQL for ACF** | Exposes ACF fields to GraphQL | Yes |
| **Yoast SEO** | SEO management | Recommended |
| **WPGraphQL Yoast SEO Addon** | Exposes Yoast data to GraphQL | Recommended |
| **Faust.js Plugin** | Preview support, authentication | For previews |
| **Headless Mode** | Disables frontend theme entirely | Optional |
| **WPGraphQL JWT Authentication** | Secure authentication | For auth |
| **WP Webhooks** | Trigger rebuilds on content change | For ISR |

### Plugin Installation Order

1. Install and activate **WPGraphQL**
2. Install and activate **ACF Pro**
3. Install and activate **WPGraphQL for ACF**
4. Configure GraphQL settings at `/wp-admin/admin.php?page=graphql-settings`
5. Verify GraphQL IDE works at `/wp-admin/admin.php?page=graphql-ide`

### WordPress Configuration

```php
// functions.php - Recommended settings

// Enable CORS for headless frontend
add_action('init', function() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
});

// Increase GraphQL query depth if needed
add_filter('graphql_max_query_depth', function() {
    return 15;
});
```

---

## API Options: WPGraphQL vs REST

### Quick Comparison

| Feature | WPGraphQL | REST API |
|---------|-----------|----------|
| **Data Fetching** | Fetch exactly what you need | Get entire resource payloads |
| **Requests** | Single request for multiple resources | Multiple round-trips |
| **Learning Curve** | Higher (query language) | Lower (standard HTTP) |
| **Caching** | More complex | Simpler (predictable URLs) |
| **Schema** | Strongly typed | Loosely typed |
| **Tooling** | GraphiQL, Voyager | Standard REST tools |
| **Built-in** | Requires plugin | Core WordPress (since 4.7) |

### When to Use REST API

- Small, simple projects (blogs, landing pages)
- Heavy caching requirements
- Lower learning curve needed
- Simple data exchanges (RSS feeds, webhooks)

### When to Use WPGraphQL

- Complex, content-heavy projects
- Enterprise-grade applications
- Multiple content types in single requests
- Need for strongly-typed schema
- Clear frontend/backend separation

### Hybrid Approach

Many production sites use both:
- **GraphQL** for UI rendering and complex data fetching
- **REST** for simpler operations like authorization, webhooks, or triggering server jobs

### GraphQL Query Example

```graphql
query GetHomepageData {
  posts(first: 6) {
    nodes {
      id
      title
      excerpt
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
  pages(where: { name: "about" }) {
    nodes {
      title
      content
    }
  }
  menuItems(where: { location: PRIMARY }) {
    nodes {
      label
      url
    }
  }
}
```

---

## Frontend Framework Options

### Framework Comparison

| Framework | Language | Rendering | Best For |
|-----------|----------|-----------|----------|
| **Next.js** | React | SSG, SSR, ISR | Production headless sites |
| **Astro** | Multi-framework | SSG, SSR | Content-focused, blogs |
| **Nuxt.js** | Vue | SSG, SSR | Vue ecosystem projects |
| **SvelteKit** | Svelte | SSG, SSR | Performance-critical sites |
| **Gatsby** | React | SSG | Plugin-heavy content sites |

### Recommended: Next.js

Next.js is the dominant choice for headless WordPress due to:

- **Incremental Static Regeneration (ISR)**: Update content without full rebuild
- **Draft Mode**: Preview unpublished content
- **Vercel Integration**: Seamless deployment and edge functions
- **React Server Components**: Improved performance
- **Large Ecosystem**: Most tutorials, starters, and community support

### Next.js Rendering Strategies

```javascript
// Static Site Generation (SSG) - Build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Incremental Static Regeneration (ISR) - Revalidate on interval
export const revalidate = 60; // Revalidate every 60 seconds

// Server-Side Rendering (SSR) - Every request
export const dynamic = 'force-dynamic';
```

---

## Real-Time Preview Setup

### Option 1: Faust.js (Recommended for WP Engine)

Faust.js is an open-source framework by WP Engine built on Next.js that provides:
- Authenticated preview of draft content
- Template hierarchy (like WordPress themes)
- Headless secret authentication

**Setup Requirements:**
1. Install Faust.js WordPress plugin
2. Configure headless secret in WordPress
3. Create `pages/preview.js` using `WordPressTemplate` component
4. Implement authentication flow

**Authentication Flow:**
1. User requests draft post preview
2. Redirects to WordPress for login
3. WordPress redirects back with temporary code
4. Frontend exchanges code for access token
5. Token stored in cookie for authenticated requests

### Option 2: Next.js Draft Mode

Next.js has built-in Draft Mode for previewing headless CMS content:

```javascript
// app/api/draft/route.js
import { draftMode } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable Draft Mode
  draftMode().enable();

  // Redirect to the post
  redirect(`/posts/${slug}`);
}
```

### Option 3: HeadstartWP (by 10up)

Uses short-lived JWT tokens (5 min expiry) that don't require a hardcoded secret between WordPress and Next.js.

### Safari Note

Safari has a bug where Secure cookies cannot be set on localhost. For local development, set up HTTPS or use a different browser.

---

## Custom Post Types & ACF

### Registering Custom Post Types for GraphQL

When registering custom post types, include `show_in_graphql`:

```php
// functions.php
register_post_type('portfolio', [
    'labels' => [
        'name' => 'Portfolio',
        'singular_name' => 'Portfolio Item',
    ],
    'public' => true,
    'has_archive' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'portfolioItem',
    'graphql_plural_name' => 'portfolioItems',
    'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
]);

register_post_type('service', [
    'labels' => [
        'name' => 'Services',
        'singular_name' => 'Service',
    ],
    'public' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'service',
    'graphql_plural_name' => 'services',
    'supports' => ['title', 'editor', 'thumbnail'],
]);
```

### ACF Field Groups in GraphQL

**Step 1:** Create field group in ACF

**Step 2:** Enable GraphQL in field group settings:
- Set "Show in GraphQL" to **Yes**
- Set "GraphQL Field Name" (e.g., `portfolioFields`)

**Step 3:** Query in GraphQL:

```graphql
query GetPortfolioItems {
  portfolioItems {
    nodes {
      title
      slug
      featuredImage {
        node {
          sourceUrl
        }
      }
      portfolioFields {
        clientName
        projectUrl
        technologies
        completionDate
      }
    }
  }
}
```

### Content Type Recommendations

| Content Type | Implementation |
|--------------|----------------|
| **Blog Posts** | Default `post` type |
| **Portfolio** | Custom post type with ACF for project details |
| **Services** | Custom post type with ACF for pricing, features |
| **Testimonials** | Custom post type with ACF for client info |
| **Team Members** | Custom post type with ACF for bio, social links |
| **Case Studies** | Custom post type with ACF for metrics, outcomes |

### Current Limitations

- **No Meta Queries**: WPGraphQL for ACF doesn't support filtering/sorting by ACF fields (performance reasons)
- **No Mutations Yet**: Cannot create/update content via GraphQL mutations with ACF (in development)

---

## Hosting & Deployment

### WordPress Backend Hosting

| Provider | Type | Best For |
|----------|------|----------|
| **Kinsta** | Managed | Performance, enterprise |
| **WP Engine** | Managed | Faust.js integration |
| **Flywheel** | Managed | Agency workflows |
| **DigitalOcean + Docker** | Self-hosted | Cost control, flexibility |
| **Cloudways** | Managed VPS | Balance of control and support |

### Frontend Hosting

| Provider | Strengths |
|----------|-----------|
| **Vercel** | Native Next.js, ISR, edge functions, easy preview deployments |
| **Netlify** | Great for static/JAMstack, forms, functions |
| **Cloudflare Pages** | Edge deployment, fast globally, generous free tier |
| **AWS Amplify** | AWS ecosystem integration |

### Deployment Architecture

```
Production Setup:
├── WordPress (e.g., Kinsta)
│   ├── Private admin URL
│   ├── WPGraphQL endpoint: /graphql
│   └── Webhooks → trigger Vercel rebuild
│
└── Next.js (e.g., Vercel)
    ├── SSG pages with ISR
    ├── API routes for previews
    └── Edge functions for dynamic content
```

### Environment Variables

```env
# .env.local (Next.js)
WORDPRESS_API_URL=https://your-wp-site.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your-refresh-token
PREVIEW_SECRET=your-preview-secret
REVALIDATE_SECRET=your-revalidate-secret
```

---

## Starter Templates

### Official & Recommended

| Starter | Description | Link |
|---------|-------------|------|
| **Vercel WordPress Starter** | Official template with ISR | [vercel.com/templates](https://vercel.com/templates/next.js/nextjs-wordpress-headless-cms) |
| **next-wp** | Next.js 16, React 19, TypeScript | [github.com/9d8dev/next-wp](https://github.com/9d8dev/next-wp) |
| **gregrickaby/nextjs-wordpress** | Minimal, production-ready, fully typed | [github.com/gregrickaby](https://github.com/gregrickaby/nextjs-wordpress) |
| **WebDevStudios Starter** | Enterprise-grade | [webdevstudios.github.io](https://webdevstudios.github.io/nextjs-wordpress-starter/) |
| **Faust.js** | WP Engine's official framework | [faustjs.org](https://faustjs.org/) |
| **HeadstartWP** | 10up's framework | [headstartwp.10up.com](https://headstartwp.10up.com/) |

### Starter Selection Guide

- **Quick start, Vercel hosting**: Vercel WordPress Starter
- **TypeScript, modern stack**: next-wp or gregrickaby starter
- **WP Engine hosting + previews**: Faust.js
- **Enterprise with full support**: WebDevStudios or HeadstartWP

---

## Alternative CMS Options

If WordPress headless doesn't fit the project, consider:

| CMS | Type | Best For |
|-----|------|----------|
| **Strapi** | Open-source, self-hosted | Full control, Node.js stack |
| **Sanity** | SaaS | Real-time collaboration, structured content |
| **Payload CMS** | Open-source | TypeScript, code-first |
| **Contentful** | Enterprise SaaS | Large teams, content modeling |
| **Directus** | Open-source | Existing databases, SQL-based |
| **Storyblok** | SaaS | Visual editing, component-based |

### When NOT to Use WordPress Headless

- Need real-time collaboration (consider Sanity)
- Fully TypeScript-native stack (consider Payload)
- Starting fresh with no WordPress expertise
- Simple blog (consider Astro + Markdown)

---

## Implementation Checklist

### Phase 1: WordPress Setup

- [ ] Set up WordPress on managed hosting
- [ ] Install and configure WPGraphQL
- [ ] Install and configure ACF Pro
- [ ] Install WPGraphQL for ACF
- [ ] Register custom post types (portfolio, services, etc.)
- [ ] Create ACF field groups for each post type
- [ ] Enable GraphQL for all field groups
- [ ] Configure Yoast SEO + WPGraphQL addon
- [ ] Test queries in GraphQL IDE
- [ ] Set up webhook for frontend rebuilds

### Phase 2: Frontend Setup

- [ ] Create Next.js project from starter template
- [ ] Configure environment variables
- [ ] Set up GraphQL client (Apollo, urql, or fetch)
- [ ] Create page templates for each content type
- [ ] Implement navigation/menus
- [ ] Add ISR for content updates
- [ ] Configure Draft Mode for previews

### Phase 3: Preview System

- [ ] Install Faust.js plugin on WordPress
- [ ] Configure headless secret
- [ ] Create preview API routes
- [ ] Test draft preview functionality
- [ ] Verify preview works across content types

### Phase 4: Deployment

- [ ] Deploy WordPress to production host
- [ ] Configure WordPress for API-only mode
- [ ] Deploy Next.js to Vercel/Netlify
- [ ] Set up webhook from WordPress → Vercel
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Test production preview flow

### Phase 5: Optimization

- [ ] Implement image optimization
- [ ] Add SEO meta tags from Yoast
- [ ] Set up analytics
- [ ] Configure caching strategy
- [ ] Performance testing (Lighthouse)
- [ ] Security audit

---

## Resources

### Documentation

- [WPGraphQL Docs](https://www.wpgraphql.com/docs/)
- [WPGraphQL for ACF Docs](https://acf.wpgraphql.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Faust.js Docs](https://faustjs.org/docs/)
- [Vercel WordPress Guide](https://vercel.com/guides/wordpress-with-vercel)

### Tutorials

- [Kinsta: Headless WordPress + Next.js](https://kinsta.com/blog/headless-wordpress-next-js/)
- [freeCodeCamp: WordPress + Next.js](https://www.freecodecamp.org/news/integrate-wordpress-with-nextjs/)
- [WP Engine: Custom Content with ACF + WPGraphQL](https://wpengine.com/builders/custom-content-in-headless-wordpress-using-advanced-custom-fields-and-wpgraphql/)
- [WP Engine: Previews in Headless WordPress](https://wpengine.com/builders/previews-in-headless-wordpress-using-nextjs/)

### Communities

- [WPGraphQL Discord](https://discord.gg/wpgraphql)
- [Faust.js Discord](https://discord.gg/wpgraphql)
- [Next.js Discord](https://nextjs.org/discord)

---

*Last updated: January 2026*
