# Starter WP Theme

## About

A modern WordPress starter theme with a headless Next.js frontend, featuring StoryBrand framework components, GSAP animations, and Headroom.js navigation.

![Hero Section Preview](frontend/public/images/theme-preview.png)

### Features

- **StoryBrand Framework** - Pre-built wireframe components following Donald Miller's messaging methodology
- **Headroom.js Navigation** - Smart header that hides on scroll down, shows on scroll up
- **GSAP ScrollTrigger** - Smooth scroll-based animations and effects
- **shadcn/ui Components** - Beautiful, accessible React components
- **WordPress Integration** - Headless CMS with REST API content fetching
- **Tailwind CSS 4** - Modern utility-first styling
- **Progressive Web App** - Installable PWA with offline support via Serwist

---

## PWA Assets

### Generate Icons

Replace the source icon and regenerate all sizes:

```bash
cd frontend

# Place your 512x512 source icon at public/icons/icon-512x512.png
npm run generate-icons
```

This creates all required PWA icon sizes (72x72 to 512x512) plus maskable variants.

### Generate Screenshots

Capture PWA install screenshots from your running app:

```bash
cd frontend

# Start dev server first
npm run dev

# In another terminal, generate screenshots
npm run generate-screenshots
```

This creates:
- `frontend/public/screenshots/desktop.png` (1280×720)
- `frontend/public/screenshots/mobile.png` (750×1334)

**Note:** The dev server must be running on `localhost:3000` for screenshot generation.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

For complete deployment instructions including:
- Deploying Next.js to Vercel
- Deploying WordPress to Flywheel or WP Engine
- Configuring webhooks and preview mode
- Custom domain setup
- Environment variables reference
- Troubleshooting guide

**See the [Deployment Guide](DEPLOYMENT.md) for step-by-step instructions.**
