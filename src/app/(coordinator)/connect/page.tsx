"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProviderCard } from "@/components/provider/ProviderCard";
import { SearchFilters } from "@/components/search/SearchFilters";
import { useProviderSearch } from "@/hooks/useProviderSearch";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

function ConnectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading } = useProviderSearch();

  const [participantName, setParticipantName] = useState("");
  const [ndisNumber, setNdisNumber] = useState("");
  const [searchInput, setSearchInput] = useState(searchParams.get("q") || "");
  const [postcodeInput, setPostcodeInput] = useState(searchParams.get("postcode") || "");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) params.set("q", searchInput.trim());
    else params.delete("q");
    if (postcodeInput) params.set("postcode", postcodeInput);
    else params.delete("postcode");
    params.delete("page");
    router.push(`/connect?${params.toString()}`);
  }

  function handleRefer(slug: string) {
    const params = new URLSearchParams();
    params.set("provider", slug);
    if (participantName) params.set("participantName", participantName);
    if (ndisNumber) params.set("ndisNumber", ndisNumber);
    router.push(`/connect/request?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold text-gray-900">
        Find services for your participants
      </h1>

      {/* Participant context */}
      <div className="mt-4 rounded-xl border bg-white p-4">
        <p className="mb-3 text-sm font-medium text-gray-500">
          Searching on behalf of:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label className="text-xs">Participant Name</Label>
            <Input
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              placeholder="Enter participant name (for your records only)"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">NDIS Number (optional)</Label>
            <Input
              value={ndisNumber}
              onChange={(e) => setNdisNumber(e.target.value)}
              placeholder="e.g. 43XXXXXXXX"
              className="mt-1"
            />
          </div>
        </div>
        <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Lock size={12} /> This information is for your records only and is
          not shared with providers.
        </p>
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="mt-4 flex flex-wrap items-center gap-3"
      >
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search services..."
            className="h-10 pl-9"
          />
        </div>
        <Input
          value={postcodeInput}
          onChange={(e) =>
            setPostcodeInput(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          placeholder="Postcode"
          inputMode="numeric"
          maxLength={4}
          className="h-10 w-32"
        />
        <Button
          type="submit"
          className="h-10 bg-blue-600 px-6 text-white hover:bg-blue-700"
        >
          Search
        </Button>
      </form>

      <div className="mt-2">
        <Link
          href="/connect/request"
          className="text-sm text-indigo-600 hover:underline"
        >
          Submit Request Without Specific Provider →
        </Link>
      </div>

      {/* Results */}
      <div className="mt-6 flex gap-6">
        <aside className="hidden w-72 shrink-0 lg:block">
          <SearchFilters />
        </aside>
        <div className="min-w-0 flex-1">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border p-5">
                  <div className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : data?.providers?.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No providers found. Try adjusting your search.
            </p>
          ) : (
            data?.providers?.map((provider: Record<string, unknown>) => (
              <div key={provider.id as string}>
                <ProviderCard provider={provider as any} />
                <div className="-mt-2 mb-4 flex justify-end">
                  <button
                    onClick={() => handleRefer(provider.slug as string)}
                    className="rounded-lg border border-indigo-300 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50"
                  >
                    Refer →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading...</div>}>
      <ConnectInner />
    </Suspense>
  );
}
