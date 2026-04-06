"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const ProviderLocationMapInner = dynamic(
  () =>
    import("@/components/provider/ProviderLocationMapInner").then(
      (mod) => mod.ProviderLocationMapInner
    ),
  {
    ssr: false,
    loading: () => <Skeleton className="h-56 w-full" />,
  }
);

interface ProviderLocationMapProps {
  latitude: number;
  longitude: number;
  hideExactAddress?: boolean;
  providerName: string;
}

export function ProviderLocationMap(props: ProviderLocationMapProps) {
  return (
    <div className="h-56">
      <ProviderLocationMapInner {...props} />
    </div>
  );
}
