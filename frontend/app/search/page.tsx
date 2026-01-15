"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2, FileText } from "lucide-react";
import { BodyClass } from "@/components/BodyClass";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SearchResult } from "@/lib/wordpress";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Clemson Sports Media";

// Search result card component
function SearchResultCard({ result }: { result: SearchResult }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image Section */}
      <Link href={result.url} className="relative block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl bg-neutral-100">
          {result.image ? (
            <Image
              src={result.image.url}
              alt={result.image.alt || result.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 600px, 500px"
              quality={85}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-100">
              <FileText className="h-16 w-16 text-neutral-300" />
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={result.url}>
          <h3 className="font-heading text-lg font-bold leading-snug text-neutral-900 transition-colors group-hover:text-[var(--clemson-orange)] line-clamp-2">
            {result.title}
          </h3>
        </Link>

        {result.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-neutral-600">
            {result.excerpt}
          </p>
        )}

        <div className="mt-auto pt-4">
          <span className="inline-block rounded-full bg-[var(--clemson-orange)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--clemson-orange)]">
            {result.type === "post" ? "Article" : result.type === "page" ? "Page" : "Service"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton for Suspense fallback
function SearchLoadingSkeleton() {
  return (
    <>
      <BodyClass className="search-results" />

      {/* Search Header with Watermark */}
      <section className="bg-gray-100 pt-32 pb-16 md:pt-48 md:pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-20 tracking-widest text-center leading-none">
              Search
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Search</span>
            </nav>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Search
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-6" />

            {/* Search Form Placeholder */}
            <div className="max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <div className="h-12 bg-white rounded-md border border-gray-300 animate-pulse" />
              </div>
              <div className="h-12 w-24 bg-[var(--clemson-orange)]/50 rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Loading Results */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--clemson-orange)]" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </section>
    </>
  );
}

// Inner component that uses useSearchParams
function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fetch search results
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}&types=post&per_page=50`
      );
      if (!response.ok) {
        throw new Error("Search request failed");
      }
      const searchResults: SearchResult[] = await response.json();
      setResults(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch results when query param changes
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      fetchResults(queryParam);
    }
  }, [queryParam, fetchResults]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Dynamic body classes
  const bodyClasses = ["search-results", searched ? "has-results" : ""].join(" ");

  return (
    <>
      <BodyClass className={bodyClasses} />

      {/* Search Header with Watermark */}
      <section className="bg-gray-100 pt-32 pb-16 md:pt-48 md:pb-24 relative overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Watermark Background */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4"
            aria-hidden="true"
          >
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold uppercase text-[var(--clemson-orange)] opacity-20 tracking-widest text-center leading-none">
              Search
            </span>
          </div>

          {/* Header Content */}
          <div className="relative z-10 text-center">
            {/* Breadcrumb */}
            <nav className="mb-4 text-sm text-gray-500">
              <Link href="/" className="hover:text-[var(--clemson-orange)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Search</span>
            </nav>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {queryParam ? `Results for "${queryParam}"` : "Search"}
            </h1>

            {/* Orange accent line */}
            <div className="w-24 h-1 bg-[var(--clemson-orange)] mx-auto mb-6" />

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-gray-300 focus:border-[var(--clemson-orange)] focus:ring-[var(--clemson-orange)]"
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 bg-[var(--clemson-orange)] hover:bg-[var(--clemson-purple)] text-white font-heading font-bold uppercase tracking-wider"
              >
                Search
              </Button>
            </form>

            {/* Result count */}
            {searched && !loading && (
              <p className="mt-4 text-gray-600">
                {results.length} {results.length === 1 ? "result" : "results"}{" "}
                found
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--clemson-orange)]" />
              <p className="mt-4 text-gray-600">Searching...</p>
            </div>
          ) : searched && results.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result) => (
                <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
              ))}
            </div>
          ) : searched && results.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                No results found for &quot;{queryParam}&quot;
              </p>
              <p className="text-gray-500 mb-6">
                Try different keywords or browse our categories
              </p>
              <Link
                href="/blog"
                className="inline-block text-[var(--clemson-orange)] hover:underline font-semibold"
              >
                ← Browse All Articles
              </Link>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <p className="text-lg text-gray-600">
                Enter a search term to find articles
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Main export wrapped in Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoadingSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
