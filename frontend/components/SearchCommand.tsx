"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FileText, File, Briefcase, Search, Loader2 } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchResult } from "@/lib/wordpress";
import { getEnabledSearchTypes, type SearchableType } from "@/lib/search-config";

// Icon mapping for content types
const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  File,
  Briefcase,
};

interface SearchCommandProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SearchCommand({ open: controlledOpen, onOpenChange }: SearchCommandProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Support both controlled and uncontrolled modes
  const isOpen = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  // Memoize to prevent new array reference on every render
  const enabledTypes = useMemo(() => getEnabledSearchTypes(), []);

  // Keyboard shortcut: Cmd/Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setOpen]);

  // Debounced search via API route
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const types = enabledTypes.map(t => t.type).join(",");
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&types=${types}&per_page=10`
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
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, enabledTypes]);

  // Handle result selection
  const handleSelect = useCallback((url: string) => {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(url);
  }, [router, setOpen]);

  // Handle view all results
  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setResults([]);
    }
  }, [query, router, setOpen]);

  // Group results by type
  const groupedResults = enabledTypes.reduce((acc, typeConfig) => {
    const typeResults = results.filter(r => r.type === typeConfig.type);
    if (typeResults.length > 0) {
      acc.push({ config: typeConfig, results: typeResults });
    }
    return acc;
  }, [] as { config: SearchableType; results: SearchResult[] }[]);

  // Handle Enter key when no item is selected
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim() && !loading) {
      // Check if any item is highlighted/selected - if not, go to search page
      const selectedItem = document.querySelector('[cmdk-item][data-selected="true"]');
      if (!selectedItem) {
        e.preventDefault();
        handleViewAll();
      }
    }
  }, [query, loading, handleViewAll]);

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen} className="sm:max-w-[50vw]">
      <CommandInput
        placeholder="Search posts, pages, services..."
        value={query}
        onValueChange={setQuery}
        onKeyDown={handleKeyDown}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
        )}

        {!loading && groupedResults.map(({ config, results: groupResults }) => {
          const Icon = icons[config.icon] || FileText;
          return (
            <CommandGroup key={config.type} heading={config.label}>
              {groupResults.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  value={`${result.title} ${result.type}`}
                  onSelect={() => handleSelect(result.url)}
                  className="cursor-pointer"
                >
                  {result.image ? (
                    <div className="relative mr-3 h-10 w-10 shrink-0 overflow-hidden rounded">
                      <Image
                        src={result.image.url}
                        alt={result.image.alt || result.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <Icon className="mr-3 h-10 w-10 shrink-0 rounded bg-muted p-2 text-muted-foreground" />
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-medium">{result.title}</span>
                    {result.excerpt && (
                      <span className="truncate text-xs text-muted-foreground">
                        {result.excerpt}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}

        {!loading && !query && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            <Search className="mx-auto mb-2 h-6 w-6" />
            <p>Start typing to search...</p>
            <p className="mt-1 text-xs">
              Press <kbd className="rounded border bg-muted px-1">Esc</kbd> to close
            </p>
          </div>
        )}

        {/* View all results link */}
        {!loading && query && results.length > 0 && (
          <div className="border-t p-3 text-center">
            <button
              onClick={handleViewAll}
              className="text-sm font-medium text-[var(--clemson-orange)] hover:underline"
            >
              View all results for &quot;{query}&quot; →
            </button>
            <p className="mt-1 text-xs text-muted-foreground">
              Press <kbd className="rounded border bg-muted px-1">Enter</kbd> to view all results
            </p>
          </div>
        )}
      </CommandList>
    </CommandDialog>
  );
}
