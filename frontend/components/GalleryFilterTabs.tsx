"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import type { WPEventType } from "@/lib/wordpress";

interface GalleryFilterTabsProps {
  eventTypes: WPEventType[];
}

export function GalleryFilterTabs({ eventTypes }: GalleryFilterTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSport = searchParams.get("sport") || "all";
  const currentSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(currentSearch);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== currentSearch) {
        const params = new URLSearchParams(searchParams.toString());
        if (searchValue) {
          params.set("search", searchValue);
        } else {
          params.delete("search");
        }
        params.delete("page");
        const queryString = params.toString();
        router.push(queryString ? `/photo-gallery?${queryString}` : "/photo-gallery");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, currentSearch, searchParams, router]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("sport");
    } else {
      params.set("sport", value);
    }
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `/photo-gallery?${queryString}` : "/photo-gallery");
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Sport Tabs */}
      <Tabs value={currentSport} onValueChange={handleTabChange}>
        <TabsList className="h-auto flex-wrap gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="rounded-none border-b-2 border-transparent px-4 py-2 font-heading text-sm font-bold uppercase tracking-wider data-[state=active]:border-[var(--clemson-orange)] data-[state=active]:text-[var(--clemson-orange)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            All
          </TabsTrigger>
          {eventTypes.map((et) => (
            <TabsTrigger
              key={et.id}
              value={et.slug}
              className="rounded-none border-b-2 border-transparent px-4 py-2 font-heading text-sm font-bold uppercase tracking-wider data-[state=active]:border-[var(--clemson-orange)] data-[state=active]:text-[var(--clemson-orange)] data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {et.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search galleries..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-10 w-full rounded-none border border-gray-200 bg-white pl-10 pr-4 text-sm focus:border-[var(--clemson-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--clemson-orange)] sm:w-64"
        />
      </div>
    </div>
  );
}
