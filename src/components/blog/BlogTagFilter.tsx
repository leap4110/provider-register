"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface BlogTagFilterProps {
  tags: { name: string; count: number }[];
  activeTag?: string;
}

export function BlogTagFilter({ tags, activeTag }: BlogTagFilterProps) {
  const router = useRouter();

  return (
    <div className="mb-8 mt-6 flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => router.push("/blog")}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          !activeTag
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        )}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag.name}
          onClick={() => router.push(`/blog?tag=${encodeURIComponent(tag.name)}`)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            activeTag === tag.name
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}
