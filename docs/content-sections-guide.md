# Content Sections Guide

This guide explains how to use the Breaking News Section and Latest Articles section components on the Clemson Sports Media homepage.

---

## Breaking News Section

A 4-column grid section that displays breaking news articles with vertical cards.

### Component Location

```
frontend/components/BreakingNewsSection.tsx
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `posts` | `WPPost[]` | Yes | Array of WordPress posts to display (max 4 shown) |
| `categories` | `WPCategory[]` | No | Categories array for resolving category names |
| `className` | `string` | No | Additional CSS classes |

### Usage

```tsx
import { BreakingNewsSection } from "@/components/BreakingNewsSection";

// In your page component
<BreakingNewsSection
  posts={breakingNewsPosts}
  categories={categories}
/>
```

### How It Works

1. **Section Header**: Displays "BREAKING NEWS" with an orange accent line
2. **Grid Layout**: 4-column grid on desktop, 2 columns on tablet, 1 column on mobile
3. **Article Cards**: Uses `ArticleCard` component with `variant="vertical"`
4. **Category Resolution**: Automatically resolves category IDs to names

### Responsive Breakpoints

| Breakpoint | Columns |
|------------|---------|
| Mobile (< 640px) | 1 column |
| Tablet (640px - 1024px) | 2 columns |
| Desktop (> 1024px) | 4 columns |

### Styling

The section uses Clemson brand colors:
- Header accent line: `var(--clemson-orange)` (#F56600)
- Typography: `font-heading` (Apotek Medium)

### Example Output

```
┌─────────────────────────────────────────────────────────┐
│  BREAKING NEWS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
├─────────────┬─────────────┬─────────────┬─────────────┤
│  [Image]    │  [Image]    │  [Image]    │  [Image]    │
│  Category   │  Category   │  Category   │  Category   │
│  Title...   │  Title...   │  Title...   │  Title...   │
│  Jan 14     │  Jan 14     │  Jan 13     │  Jan 13     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## Latest Articles Section with Sidebar

A two-column layout with a main content area (Latest articles list) and a sidebar placeholder.

### Component Location

The Latest Articles section is composed in the homepage directly using:
- `frontend/components/CompactArticleList.tsx` - Main content area
- Inline sidebar markup in `frontend/app/page.tsx`

### CompactArticleList Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `posts` | `WPPost[]` | Yes | - | Array of posts to display |
| `categories` | `WPCategory[]` | No | `[]` | Categories for name resolution |
| `title` | `string` | No | `"Latest"` | Section title |
| `viewAllLink` | `string` | No | - | URL for "View All" link |
| `viewAllText` | `string` | No | `"VIEW ALL →"` | Text for the link |
| `className` | `string` | No | `""` | Additional CSS classes |

### Usage

```tsx
import { CompactArticleList } from "@/components/CompactArticleList";

// Full example with sidebar
<section className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Main content - 2/3 width */}
    <div className="lg:col-span-2">
      <CompactArticleList
        posts={latestPosts}
        categories={categories}
        title="Latest"
        viewAllLink="/blog"
        viewAllText="VIEW ALL ARTICLES →"
      />
    </div>

    {/* Sidebar - 1/3 width */}
    <aside className="lg:col-span-1">
      <div className="sticky top-24">
        {/* Sidebar content here */}
      </div>
    </aside>

  </div>
</section>
```

### How It Works

1. **Grid Layout**: 3-column grid where main content spans 2 columns, sidebar spans 1
2. **Section Header**: Title with orange accent line
3. **Article List**: Horizontal cards with thumbnail, category, title, and date
4. **View All Link**: Optional link at bottom with orange text
5. **Sticky Sidebar**: Sidebar content sticks when scrolling

### Layout Structure

```
┌───────────────────────────────────────────────────────────────┐
│ Container (max-width, centered, padding)                       │
├─────────────────────────────────────┬─────────────────────────┤
│  LATEST ━━━━━━━━━━━━━━━━━━━━━━━━━━  │  POPULAR ━━━━━━━━━━━━━  │
│                                     │                         │
│  ┌────────┬────────────────────┐   │  (Sidebar content)      │
│  │ [Img]  │ Category           │   │                         │
│  │        │ Article Title      │   │                         │
│  │        │ Jan 14, 2026       │   │                         │
│  └────────┴────────────────────┘   │                         │
│                                     │                         │
│  ┌────────┬────────────────────┐   │                         │
│  │ [Img]  │ Category           │   │                         │
│  │        │ Article Title      │   │                         │
│  │        │ Jan 13, 2026       │   │                         │
│  └────────┴────────────────────┘   │                         │
│                                     │                         │
│  ───────────────────────────────   │                         │
│  VIEW ALL ARTICLES →                │                         │
│                                     │                         │
│  (2/3 width - lg:col-span-2)       │  (1/3 - lg:col-span-1)  │
└─────────────────────────────────────┴─────────────────────────┘
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Mobile/Tablet (< 1024px) | Single column, sidebar below main |
| Desktop (> 1024px) | 2/3 + 1/3 side-by-side layout |

### Styling Details

**Section Header:**
```css
/* Title with accent line */
.flex.items-center.gap-3
  h3.font-heading.text-lg.uppercase.tracking-tight
  div.flex-1.h-0.5.bg-[var(--clemson-orange)]
```

**View All Link:**
```css
/* Orange link with hover transition to purple */
.text-sm.font-semibold
.text-[var(--clemson-orange)]
.hover:text-[var(--clemson-purple)]
.transition-colors
.uppercase.tracking-wide
```

---

## Complete Homepage Integration

Here's how both sections are integrated on the homepage:

```tsx
// frontend/app/page.tsx

import { getPosts, getCategories } from "@/lib/wordpress";
import { HeroGrid } from "@/components/HeroGrid";
import { BreakingNewsSection } from "@/components/BreakingNewsSection";
import { CompactArticleList } from "@/components/CompactArticleList";
import { SocialCTABar } from "@/components/SocialCTABar";

export default async function HomePage() {
  // Fetch 20 posts to populate all sections
  const [posts, categories] = await Promise.all([
    getPosts({ per_page: 20 }),
    getCategories({ per_page: 100 }),
  ]);

  // Split posts for different sections
  const heroGridPosts = posts.slice(0, 5);      // Posts 1-5
  const breakingNewsPosts = posts.slice(5, 9);  // Posts 6-9
  const latestPosts = posts.slice(9, 14);       // Posts 10-14

  return (
    <>
      {/* Hero Grid - 5 featured posts */}
      <HeroGrid posts={heroGridPosts} categories={categories} />

      {/* Breaking News - 4 posts in grid */}
      <BreakingNewsSection
        posts={breakingNewsPosts}
        categories={categories}
      />

      {/* Social CTA Bar */}
      <SocialCTABar className="my-8" />

      {/* Latest + Sidebar */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CompactArticleList
              posts={latestPosts}
              categories={categories}
              title="Latest"
              viewAllLink="/blog"
              viewAllText="VIEW ALL ARTICLES →"
            />
          </div>
          <aside className="lg:col-span-1">
            {/* Sidebar content */}
          </aside>
        </div>
      </section>
    </>
  );
}
```

---

## Data Flow

```
WordPress REST API
        │
        ▼
getPosts({ per_page: 20 })
        │
        ▼
┌───────────────────────────────┐
│     posts[] (20 items)        │
├───────────────────────────────┤
│ [0-4]  → HeroGrid             │
│ [5-8]  → BreakingNewsSection  │
│ [9-13] → CompactArticleList   │
└───────────────────────────────┘
```

---

## Customization

### Changing Number of Posts

```tsx
// Show 6 breaking news items instead of 4
const breakingNewsPosts = posts.slice(5, 11);

// Update BreakingNewsSection grid (modify component)
// Change: grid-cols-4 → grid-cols-6
```

### Custom Section Titles

```tsx
<CompactArticleList
  posts={latestPosts}
  categories={categories}
  title="Recent Stories"        // Custom title
  viewAllLink="/news"           // Custom link
  viewAllText="SEE MORE NEWS →" // Custom link text
/>
```

### Adding Sidebar Content

```tsx
<aside className="lg:col-span-1">
  <div className="sticky top-24">
    {/* Popular Articles */}
    <CompactArticleList
      posts={popularPosts}
      categories={categories}
      title="Popular"
      viewAllLink="/popular"
    />

    {/* Newsletter Signup */}
    <div className="mt-8">
      <NewsletterSignup />
    </div>
  </div>
</aside>
```
