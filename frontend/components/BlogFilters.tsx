"use client";

import { Suspense } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { TagFilter } from "./TagFilter";
import type { WPCategory, WPTag } from "@/lib/wordpress";

interface BlogFiltersProps {
  categories: WPCategory[];
  tags: WPTag[];
}

// Wrapper component that handles the useSearchParams Suspense requirement
function BlogFiltersInner({ categories, tags }: BlogFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Filter by:</span>
        <CategoryFilter categories={categories} basePath="/blog" />
      </div>
      {tags.length > 0 && (
        <TagFilter tags={tags} basePath="/blog" />
      )}
    </div>
  );
}

export function BlogFilters({ categories, tags }: BlogFiltersProps) {
  return (
    <Suspense fallback={<div className="h-10 w-[400px] animate-pulse rounded bg-muted" />}>
      <BlogFiltersInner categories={categories} tags={tags} />
    </Suspense>
  );
}
