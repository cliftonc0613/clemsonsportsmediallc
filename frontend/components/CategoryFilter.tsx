"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WPCategory } from "@/lib/wordpress";

interface CategoryFilterProps {
  categories: WPCategory[];
  /** Base path for the filtered view (e.g., "/blog") */
  basePath: string;
  /** Query parameter name (default: "category") */
  paramName?: string;
  /** Placeholder text (default: "All Categories") */
  placeholder?: string;
}

export function CategoryFilter({
  categories,
  basePath,
  paramName = "category",
  placeholder = "All Categories",
}: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get(paramName) || "";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    // Reset to page 1 when changing filters
    params.delete("page");

    const queryString = params.toString();
    const url = queryString ? `${basePath}?${queryString}` : basePath;
    router.push(url);
  };

  return (
    <Select value={currentCategory || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.slug}>
            {category.name} ({category.count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
