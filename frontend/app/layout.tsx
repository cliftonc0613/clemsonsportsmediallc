import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
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
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clemsonsportsmedia.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

const organizationSchema = generateOrganizationSchema({
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: "Clemson Sports Media - Your source for Clemson athletics coverage and sports media content.",
});

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "Clemson Sports Media | Clemson Athletics Coverage",
    template: "%s | Clemson Sports Media",
  },
  description:
    "Clemson Sports Media - Your source for Clemson athletics coverage and sports media content.",
  keywords: ["Clemson", "sports", "athletics", "Tigers", "football", "basketball", "media"],
  authors: [{ name: "Clemson Sports Media" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Clemson Sports Media",
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
    title: "Clemson Sports Media",
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
        {/* Adobe Fonts - Apotek (headlines) & Basic Sans (body) */}
        <link rel="stylesheet" href="https://use.typekit.net/rlq1tnk.css" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CSM" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans antialiased">
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
