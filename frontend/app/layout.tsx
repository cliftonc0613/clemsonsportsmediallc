import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { Toaster } from "@/components/ui/sonner";
import { StructuredData } from "@/components/structured-data";
import { generateOrganizationSchema } from "@/lib/schema";
import { Providers } from "./providers";
import RegisterPWA from "@/components/RegisterPWA";
import PWALoadScreen from "@/components/PWALoadScreen.enhanced";
import RouteProgress from "@/components/RouteProgress";
import "./globals.css";

// Site-wide Organization schema for rich snippets
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Starter WP Theme";

const organizationSchema = generateOrganizationSchema({
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "A headless WordPress starter theme built with Next.js and shadcn/ui. Perfect for service-based businesses.",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Starter WP Theme | Service-Based Business",
    template: "%s | Starter WP Theme",
  },
  description:
    "A headless WordPress starter theme built with Next.js and shadcn/ui. Perfect for service-based businesses.",
  keywords: ["WordPress", "Next.js", "headless CMS", "shadcn/ui", "services"],
  authors: [{ name: "Starter WP Theme" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Starter WP Theme",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Starter WP Theme",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="StarterWP" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <Providers>
          <PWALoadScreen />
          <RegisterPWA />
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          <StructuredData data={organizationSchema} />
          <SmoothScroll />
          <ScrollAnimations />
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
