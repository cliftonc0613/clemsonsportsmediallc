---
name: wordpress-starter
description: Conversational skill that interviews you about headless WordPress project requirements and generates a structured project plan with tech stack recommendations.
---

# WordPress Starter

## Purpose

Guide users through headless WordPress project planning via conversational interview, then generate a comprehensive project configuration with architecture recommendations, plugin lists, and implementation checklists.

## When to Use This Skill

- Starting a new headless WordPress project
- Evaluating architecture decisions for WordPress + frontend framework
- Generating implementation checklists for headless CMS projects
- Comparing API strategies (GraphQL vs REST)
- Selecting frontend frameworks and hosting providers

## How This Skill Works

This skill conducts a **17-question conversational interview** across 6 sections, then generates:
1. A JSON configuration file with all project decisions
2. A markdown summary with architecture diagram and recommendations
3. An implementation checklist organized by phase

---

## Interview Flow

### Opening

Start with a friendly introduction:

> "I'll help you plan your headless WordPress project by asking some questions about your goals, content needs, and technical preferences. This will take about 5-10 minutes, and at the end you'll have a complete project plan with recommendations.
>
> Let's start with understanding your project..."

---

### Section 1: Project Context (3 Questions)

Ask these questions **one at a time**, waiting for user response before proceeding.

#### Question 1: Project Type
> "What type of website are you building?"

Options to present:
- **Blog/Content Site** - Primarily articles, news, or educational content
- **Portfolio** - Showcasing work, projects, or creative pieces
- **Business/Services** - Company site with service offerings
- **E-commerce** - Online store with products and checkout
- **Full Business Site** - Combination of blog, services, portfolio, and/or store

#### Question 2: Primary Goal
> "What's the primary goal of this project?"

Options to present:
- **Lead Generation** - Capture contacts and drive inquiries
- **Content Marketing** - Establish thought leadership and drive traffic
- **Online Sales** - Sell products or services directly
- **Brand Presence** - Professional online identity and credibility
- **Community/Membership** - Build audience engagement and recurring visitors

#### Question 3: Migration Status
> "Do you have an existing WordPress site to migrate, or is this a fresh start?"

Options:
- **Fresh Start** - Building from scratch
- **Migration from WordPress** - Moving existing WP content to headless
- **Migration from Other CMS** - Moving from Squarespace, Wix, etc.
- **Rebuild Existing Site** - Recreating current site with new architecture

---

### Section 2: Content Architecture (3 Questions)

#### Question 4: Content Types
> "What content types will your site need? Select all that apply."

Present as multi-select options:
- **Blog Posts** - Articles, news, tutorials
- **Pages** - Static content pages (About, Contact, etc.)
- **Portfolio Items** - Projects, case studies, work samples
- **Services** - Service offerings with descriptions and pricing
- **Testimonials** - Client reviews and success stories
- **Team Members** - Staff profiles and bios
- **Products** - E-commerce product listings
- **Events** - Upcoming events or past event archives
- **FAQs** - Frequently asked questions
- **Other** (ask for specifics)

#### Question 5: Custom Fields Requirement
> "Will you need custom fields for structured content? For example, portfolio items might need client name, project URL, and completion date fields."

If user is unsure, explain:
> "Custom fields (using ACF - Advanced Custom Fields) let you create structured data beyond the default WordPress title/content. They're essential for content types like portfolios, services, or products where you need specific data fields."

Options:
- **Yes, definitely** - Multiple custom post types with specific fields
- **Probably** - Some structured content beyond basic posts/pages
- **Minimal** - Mostly standard blog posts and pages
- **Not sure** - Need guidance on this decision

#### Question 6: Content Update Frequency
> "How frequently will content be updated?"

Options:
- **Daily** - Multiple updates per day
- **Weekly** - A few times per week
- **Monthly** - Occasional updates
- **Rarely** - Mostly static site with infrequent changes

*Note: This affects whether ISR (Incremental Static Regeneration) or on-demand revalidation is recommended.*

---

### Section 3: API Strategy (3 Questions)

#### Question 7: Data Fetching Complexity
> "How complex is your data fetching likely to be?"

Options with explanations:
- **Simple** - Individual pages, blog lists, basic navigation
- **Moderate** - Related content (posts with categories, authors with posts)
- **Complex** - Multiple related content types in single views (homepage with posts, services, testimonials, team)
- **Deeply Nested** - Hierarchical content with multiple levels of relationships

#### Question 8: API Recommendation
Based on Q7 response, provide a recommendation:

**For Simple/Moderate:**
> "Based on your needs, the **REST API** would work well. It's built into WordPress, simpler to cache, and has a lower learning curve. However, GraphQL is also an option if you want more control over data fetching.
>
> Do you want to go with REST API, or would you prefer GraphQL?"

**For Complex/Deeply Nested:**
> "Based on your needs, **WPGraphQL** is the better choice. It lets you fetch exactly the data you need in a single request, which is ideal for complex pages with multiple content types.
>
> Do you want to go with GraphQL, or would you prefer the simpler REST API despite the extra requests?"

Options:
- **GraphQL (WPGraphQL)** - Single requests, typed schema, exact data fetching
- **REST API** - Built-in, simpler caching, lower learning curve
- **Hybrid** - GraphQL for UI rendering, REST for webhooks/simple operations

#### Question 9: Preview Requirements
> "Do you need real-time preview of draft content in WordPress? This lets content editors see unpublished changes on the frontend before publishing."

Options:
- **Yes, essential** - Editors need to preview drafts before publishing
- **Nice to have** - Would be useful but not critical
- **No** - Publishing workflow doesn't require preview

*Note: Preview adds complexity (Faust.js, Draft Mode) but is valuable for editorial workflows.*

---

### Section 4: Frontend Framework (3 Questions)

#### Question 10: Team Experience
> "What's your team's frontend framework experience?"

Options:
- **React** - Comfortable with React ecosystem
- **Vue** - Prefer Vue.js
- **Svelte** - Experience with Svelte/SvelteKit
- **Multiple/Flexible** - Can work with any modern framework
- **Limited** - New to modern frontend frameworks

#### Question 11: Rendering Strategy
> "What rendering strategy do you prefer?"

Options with explanations:
- **Static Generation (SSG)** - Pages built at deploy time, fastest performance, best for content that doesn't change frequently
- **Server-Side Rendering (SSR)** - Pages rendered on each request, always fresh, slightly slower
- **Hybrid (ISR)** - Static pages that revalidate periodically, best of both worlds
- **Not sure** - Need guidance based on my use case

#### Question 12: Framework Recommendation
Based on Q10 and Q11, provide a recommendation:

**React + ISR/Hybrid:**
> "Based on your preferences, **Next.js** is the ideal choice. It's the dominant framework for headless WordPress with excellent ISR support, Draft Mode for previews, and the largest ecosystem of tutorials and starters."

**React + Content-focused + Performance:**
> "Based on your preferences, **Astro** could be a great fit. It ships zero JavaScript by default, supports React components when needed, and is excellent for content-heavy sites."

**Vue:**
> "Based on your preferences, **Nuxt.js** is the natural choice. It offers SSG, SSR, and hybrid modes with excellent Vue ecosystem integration."

**Svelte:**
> "Based on your preferences, **SvelteKit** offers excellent performance with a great developer experience. It supports all rendering modes."

Present the recommendation and ask:
> "Do you want to go with [recommended framework], or would you prefer a different option?"

---

### Section 5: Hosting & Deployment (3 Questions)

#### Question 13: WordPress Hosting
> "What's your WordPress hosting preference?"

Options:
- **Managed WordPress** - Kinsta, WP Engine, Flywheel (hands-off, optimized)
- **Managed VPS** - Cloudways, DigitalOcean (more control, lower cost)
- **Self-hosted** - Own server or existing infrastructure
- **Existing hosting** - Already have WordPress hosted somewhere
- **No preference** - Open to recommendations

#### Question 14: Frontend Hosting
> "What's your frontend hosting preference?"

Options:
- **Vercel** - Native Next.js support, excellent DX, generous free tier
- **Netlify** - Great for static/JAMstack, built-in forms, functions
- **Cloudflare Pages** - Fast globally, generous free tier
- **AWS Amplify** - AWS ecosystem integration
- **Self-hosted** - Own infrastructure
- **No preference** - Open to recommendations

#### Question 15: Automatic Rebuilds
> "Do you need automatic frontend rebuilds when WordPress content changes?"

Options:
- **Yes** - Content changes should trigger frontend updates automatically
- **Manual is fine** - Okay with triggering deploys manually
- **On-demand revalidation** - Only update specific pages that changed (ISR)

---

### Section 6: Project Complexity (2 Questions)

#### Question 16: Development Timeline
> "What's your development timeline?"

Options:
- **Fast MVP** - Need something live in 2-4 weeks
- **Standard** - 1-3 months for full development
- **Extended** - 3+ months, complex requirements
- **Flexible** - No hard deadline

#### Question 17: Budget Range
> "What's your budget range for hosting and tools?"

Options:
- **Minimal** - Free tiers and open-source only ($0-50/month)
- **Moderate** - Standard managed hosting ($50-200/month)
- **Enterprise** - Premium support and scaling ($200+/month)

---

## Output Generation

After completing all 17 questions, generate the following outputs:

### 1. Project Configuration JSON

Save to: `context/projects/wordpress-[projectname]-config.json`

```json
{
  "_metadata": {
    "generatedAt": "[timestamp]",
    "skillVersion": "1.0.0"
  },
  "project": {
    "name": "[from conversation]",
    "type": "[blog|portfolio|business|ecommerce|full]",
    "primaryGoal": "[lead-gen|content-marketing|sales|brand|community]",
    "migrationStatus": "[fresh|wp-migration|cms-migration|rebuild]"
  },
  "content": {
    "types": ["posts", "pages", "portfolio", "services", "testimonials", "team"],
    "customFieldsRequired": true,
    "updateFrequency": "[daily|weekly|monthly|rarely]"
  },
  "api": {
    "strategy": "[graphql|rest|hybrid]",
    "rationale": "[explanation of choice]"
  },
  "frontend": {
    "framework": "[nextjs|astro|nuxt|sveltekit]",
    "renderingStrategy": "[ssg|ssr|isr]",
    "previewRequired": true
  },
  "hosting": {
    "wordpress": "[kinsta|wpengine|cloudways|self-hosted|existing]",
    "frontend": "[vercel|netlify|cloudflare|amplify|self-hosted]",
    "automaticRebuilds": true
  },
  "timeline": {
    "type": "[mvp|standard|extended|flexible]",
    "budgetRange": "[minimal|moderate|enterprise]"
  },
  "recommendations": {
    "starterTemplate": "[template name and URL]",
    "plugins": [
      {"name": "WPGraphQL", "purpose": "GraphQL API", "required": true},
      {"name": "ACF Pro", "purpose": "Custom fields", "required": true}
    ]
  }
}
```

### 2. Project Summary Markdown

Save to: `context/projects/wordpress-[projectname]-summary.md`

Include:

#### Architecture Diagram
```
┌─────────────────────┐     [API Type]     ┌─────────────────────┐
│   WordPress CMS     │ ◄─────────────────► │   [Framework]       │
│   ([WP Hosting])    │                     │   (Presentation)    │
└─────────────────────┘                     └─────────────────────┘
         │                                           │
         ▼                                           ▼
   [WP Hosting Name]                         [Frontend Hosting]
```

#### Recommended Tech Stack
- **WordPress Backend**: [hosting choice]
- **API Strategy**: [GraphQL/REST/Hybrid] - [rationale]
- **Frontend Framework**: [framework] - [rationale]
- **Frontend Hosting**: [hosting choice]
- **Starter Template**: [template with link]

#### Required WordPress Plugins
List all recommended plugins with purposes based on selections.

#### Implementation Checklist
Organized by phase from the tooling guide reference.

### 3. Display Summary to User

After generating files, display:
- Architecture overview
- Key recommendations with rationale
- Next steps and starter template link
- File locations where config was saved

---

## Decision Logic Reference

### API Selection
| Scenario | Recommendation |
|----------|----------------|
| Simple blog/landing page | REST API |
| Complex content types | GraphQL |
| Multiple related resources per page | GraphQL |
| Heavy caching requirements | REST API |
| Enterprise/scalability needs | GraphQL |

### Framework Selection
| Scenario | Recommendation |
|----------|----------------|
| React team + ISR needs | Next.js |
| Content-focused + performance | Astro |
| Vue ecosystem | Nuxt.js |
| Performance-critical | SvelteKit |

### Starter Template Mapping
| Scenario | Recommendation |
|----------|----------------|
| Quick start + Vercel | [Vercel WordPress Starter](https://vercel.com/templates/next.js/nextjs-wordpress-headless-cms) |
| TypeScript + modern | [next-wp](https://github.com/9d8dev/next-wp) or [gregrickaby starter](https://github.com/gregrickaby/nextjs-wordpress) |
| WP Engine hosting + previews | [Faust.js](https://faustjs.org/) |
| Enterprise requirements | [WebDevStudios](https://webdevstudios.github.io/nextjs-wordpress-starter/) or [HeadstartWP](https://headstartwp.10up.com/) |

---

## Reference Files

- `references/project-config-schema.json` - Full JSON schema for output
- `references/headless-wordpress-tooling-guide.md` - Comprehensive tooling reference

---

## Tone & Best Practices

- **Conversational**: Questions should feel like a natural conversation, not a form
- **Educational**: Explain why each question matters when helpful
- **Flexible**: Allow "not sure" responses and provide guidance
- **Actionable**: End with clear next steps and resources
- **One at a time**: Never ask multiple questions in a single message
- **Adapt recommendations**: Base suggestions on actual responses, not assumptions
