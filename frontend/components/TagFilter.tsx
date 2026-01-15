"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WPTag } from "@/lib/wordpress";

interface TagFilterProps {
  tags: WPTag[];
  /** Base path for the filtered view (e.g., "/blog") */
  basePath: string;
  /** Query parameter name (default: "tag") */
  paramName?: string;
  /** Placeholder text (default: "All Tags") */
  placeholder?: string;
}

export function TagFilter({
  tags,
  basePath,
  paramName = "tag",
  placeholder = "All Tags",
}: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get(paramName) || "";

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
    <Select value={currentTag || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{placeholder}</SelectItem>
        {tags.map((tag) => (
          <SelectItem key={tag.id} value={tag.slug}>
            {tag.name} ({tag.count})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
