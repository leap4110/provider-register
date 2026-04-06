"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilters } from "@/components/search/SearchFilters";
import { ProviderCard } from "@/components/provider/ProviderCard";
import { useProviderSearch } from "@/hooks/useProviderSearch";

function SearchPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useProviderSearch();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("q") || ""
  );
  const [postcodeInput, setPostcodeInput] = useState(
    searchParams.get("postcode") || ""
  );

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "relevant";

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    } else {
      params.delete("q");
    }
    if (postcodeInput) {
      params.set("postcode", postcodeInput);
    } else {
      params.delete("postcode");
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  }

  // Active filters for badges
  const activeFilters: { label: string; key: string }[] = [];
  const category = searchParams.get("category");
  const registered = searchParams.get("registered");
  const accessMethod = searchParams.get("accessMethod");
  const ageGroup = searchParams.get("ageGroup");
  const language = searchParams.get("language");
  const delivery = searchParams.get("delivery");
  const postcode = searchParams.get("postcode");

  if (category) activeFilters.push({ label: `Category: ${category}`, key: "category" });
  if (registered) activeFilters.push({ label: registered === "true" ? "Registered" : "Not Registered", key: "registered" });
  if (postcode) activeFilters.push({ label: `Postcode: ${postcode}`, key: "postcode" });
  if (accessMethod) activeFilters.push({ label: accessMethod, key: "accessMethod" });
  if (ageGroup) activeFilters.push({ label: `Age: ${ageGroup}`, key: "ageGroup" });
  if (language) activeFilters.push({ label: language, key: "language" });
  if (delivery) activeFilters.push({ label: delivery, key: "delivery" });

  // Pagination helpers
  const totalPages = data?.pagination?.totalPages || 0;

  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "ellipsis")[] = [1];
    if (currentPage > 3) pages.push("ellipsis");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  }

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div>
      {/* Compact Search Bar */}
      <div className="sticky top-16 z-40 border-b bg-gray-50 py-3">
        <form
          onSubmit={handleSearch}
          className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search providers..."
              className="h-10 rounded-lg pl-9"
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
            className="h-10 w-32 rounded-lg"
          />
          <Button
            type="submit"
            className="h-10 bg-blue-600 px-6 font-medium text-white hover:bg-blue-700"
          >
            Search
          </Button>
        </form>
      </div>

      {/* Main content */}
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        {/* Sidebar — desktop */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <SearchFilters />
        </aside>

        {/* Results area */}
        <div className="min-w-0 flex-1">
          {/* Mobile filter button */}
          <div className="mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <button className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilters.length > 0 && (
                      <Badge className="ml-1 bg-blue-600 text-white">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </button>
                }
              />
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <div className="mt-6">
                  <SearchFilters />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-gray-600">
              {isLoading ? (
                "Searching..."
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium">
                    {data?.pagination?.total || 0}
                  </span>{" "}
                  providers
                  {searchParams.get("q") && (
                    <> for &quot;{searchParams.get("q")}&quot;</>
                  )}
                  {searchParams.get("postcode") && (
                    <> in {searchParams.get("postcode")}</>
                  )}
                </>
              )}
            </p>
            <Select
              value={currentSort}
              onValueChange={(v) => updateParam("sort", v)}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="most-reviews">Most Reviews</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="name-az">Name A–Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active filter badges */}
          {activeFilters.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="cursor-pointer gap-1 pr-1"
                  onClick={() => updateParam(filter.key, null)}
                >
                  {filter.label}
                  <span className="ml-1 rounded-full px-1 text-xs hover:bg-gray-300">
                    ✕
                  </span>
                </Badge>
              ))}
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-red-600">
                Something went wrong. Please try again.
              </p>
            </div>
          ) : data?.providers?.length === 0 ? (
            <div className="py-16 text-center">
              <SearchX className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-xl font-semibold text-gray-700">
                No providers found
              </h3>
              <p className="mt-2 text-gray-500">
                Try adjusting your filters or searching for a different service
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  const params = new URLSearchParams();
                  const q = searchParams.get("q");
                  if (q) params.set("q", q);
                  router.push(`/search?${params.toString()}`);
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              {data?.providers?.map(
                (provider: Record<string, unknown>) => (
                  <ProviderCard
                    key={provider.id as string}
                    provider={provider as ProviderCardProps["provider"]}
                  />
                )
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => goToPage(currentPage - 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                    {getPageNumbers().map((pageNum, i) =>
                      pageNum === "ellipsis" ? (
                        <PaginationItem key={`e-${i}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => goToPage(pageNum)}
                            isActive={pageNum === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => goToPage(currentPage + 1)}
                          className="cursor-pointer"
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Type for ProviderCard props used in the map
type ProviderCardProps = React.ComponentProps<typeof ProviderCard>;

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-gray-500">Loading search...</div>
      }
    >
      <SearchPageInner />
    </Suspense>
  );
}
