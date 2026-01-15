# Design Token System

This document describes the CSS custom properties (design tokens) used throughout the frontend application.

## Overview

The design system is built on Tailwind CSS v4 with OKLCH color space for perceptually uniform colors. All tokens are defined in `frontend/app/globals.css`.

## Color Tokens

### Semantic Colors

| Token | Purpose | Light Mode | Dark Mode |
|-------|---------|------------|-----------|
| `--background` | Page background | White | Near black |
| `--foreground` | Primary text | Near black | Near white |
| `--primary` | Brand/action color | Dark | Light |
| `--primary-foreground` | Text on primary | Light | Dark |
| `--secondary` | Secondary surfaces | Light gray | Dark gray |
| `--muted` | Subtle backgrounds | Light gray | Dark gray |
| `--muted-foreground` | Subtle text | Medium gray | Medium gray |
| `--accent` | Highlights | Light gray | Dark gray |
| `--destructive` | Error/danger | Red | Red |
| `--border` | Border color | Light gray | Transparent white |
| `--input` | Input borders | Light gray | Transparent white |
| `--ring` | Focus rings | Medium gray | Medium gray |

### Chart Colors

For data visualization (5 color palette):
- `--chart-1` through `--chart-5`

### Sidebar Colors

Dedicated sidebar theming:
- `--sidebar`, `--sidebar-foreground`
- `--sidebar-primary`, `--sidebar-primary-foreground`
- `--sidebar-accent`, `--sidebar-accent-foreground`
- `--sidebar-border`, `--sidebar-ring`

## Typography

Fonts are loaded via Next.js Google Fonts in `layout.tsx`:

| Variable | Font | Usage |
|----------|------|-------|
| `--font-sans` | DM Sans | Body text, UI |
| `--font-heading` | Playfair Display | Headings, display text |
| `--font-mono` | JetBrains Mono | Code, technical content |

### Usage

```tsx
// In Tailwind classes
<p className="font-sans">Body text</p>
<h1 className="font-heading">Heading</h1>
<code className="font-mono">Code</code>
```

## Spacing & Layout

Tailwind's default spacing scale is used. No custom spacing tokens.

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.625rem | Base radius |
| `--radius-sm` | `--radius - 4px` | Small elements |
| `--radius-md` | `--radius - 2px` | Medium elements |
| `--radius-lg` | `--radius` | Large elements |
| `--radius-xl` | `--radius + 4px` | Extra large |
| `--radius-2xl` | `--radius + 8px` | Cards, modals |
| `--radius-3xl` | `--radius + 12px` | Hero sections |
| `--radius-4xl` | `--radius + 16px` | Full-bleed elements |

## Component-Specific Tokens

### Header

| Token | Value | Purpose |
|-------|-------|---------|
| `--header-height` | 4rem / 3.5rem | Header height (at top / scrolled) |
| `--header-bg-opacity` | 0.6 / 0.95 | Background opacity |
| `--header-blur` | 8px / 12px | Backdrop blur |

### Usage Example

```css
/* The header automatically uses these via Headroom.js classes */
.headroom--top {
  --header-height: 4rem;
  --header-bg-opacity: 0.6;
  --header-blur: 8px;
}

.headroom--not-top {
  --header-height: 3.5rem;
  --header-bg-opacity: 0.95;
  --header-blur: 12px;
}
```

## Dark Mode

Dark mode is implemented via the `.dark` class on an ancestor element. Toggle with `next-themes`:

```tsx
import { useTheme } from 'next-themes';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

## Using Tokens in Components

### With Tailwind Classes

```tsx
// Using semantic colors
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

### With CSS Custom Properties

```css
.custom-element {
  background-color: var(--background);
  color: var(--foreground);
  border-radius: var(--radius-lg);
}
```

### With OKLCH Colors

The design system uses OKLCH for better color perception:

```css
:root {
  --background: oklch(1 0 0);        /* White */
  --foreground: oklch(0.145 0 0);    /* Near black */
  --primary: oklch(0.205 0 0);       /* Dark gray */
}
```

## Extending the System

To add new tokens:

1. Define in `globals.css` under `:root` (light) and `.dark` (dark)
2. Add to `@theme inline` block for Tailwind integration
3. Document in this file

```css
/* globals.css */
:root {
  --my-new-token: oklch(0.5 0.1 200);
}

.dark {
  --my-new-token: oklch(0.7 0.1 200);
}

@theme inline {
  --color-my-new-token: var(--my-new-token);
}
```
