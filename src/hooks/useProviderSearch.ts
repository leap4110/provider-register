import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface SearchParams {
  q?: string;
  category?: string;
  postcode?: string;
  registered?: string;
  accessMethod?: string;
  ageGroup?: string;
  language?: string;
  delivery?: string;
  sort?: string;
  page?: number;
}

export function useProviderSearch() {
  const searchParams = useSearchParams();

  const params: SearchParams = {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    postcode: searchParams.get("postcode") || undefined,
    registered: searchParams.get("registered") || undefined,
    accessMethod: searchParams.get("accessMethod") || undefined,
    ageGroup: searchParams.get("ageGroup") || undefined,
    language: searchParams.get("language") || undefined,
    delivery: searchParams.get("delivery") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
  };

  return useQuery({
    queryKey: ["providers", params],
    queryFn: async () => {
      const urlParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          urlParams.set(key, String(value));
        }
      });
      const response = await fetch(`/api/providers?${urlParams.toString()}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
  });
}
