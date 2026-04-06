"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const SearchMapInner = dynamic(
  () =>
    import("@/components/search/SearchMapInner").then(
      (mod) => mod.SearchMapInner
    ),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-[350px] w-full rounded-xl" />
    ),
  }
);

interface Provider {
  id: string;
  name: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string | null;
  state?: string | null;
  averageRating?: number | null;
  reviewCount?: number;
  ndisRegistered?: boolean;
}

interface SearchMapProps {
  providers: Provider[];
  userLocation?: { latitude: number; longitude: number } | null;
}

export function SearchMap({ providers, userLocation }: SearchMapProps) {
  return (
    <div className="h-[350px] overflow-hidden rounded-xl border">
      <SearchMapInner providers={providers} userLocation={userLocation} />
    </div>
  );
}
