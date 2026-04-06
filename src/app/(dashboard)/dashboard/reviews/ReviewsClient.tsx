"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SerializedReview {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: string;
  reviewerName: string;
  isVerified: boolean;
}

const PAGE_SIZE = 10;

export function ReviewsClient({ reviews }: { reviews: SerializedReview[] }) {
  const [sort, setSort] = useState<"recent" | "highest" | "lowest">("recent");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = [...reviews];

    if (filterRating !== "all") {
      result = result.filter((r) => r.rating === Number(filterRating));
    }

    if (sort === "highest") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === "lowest") {
      result.sort((a, b) => a.rating - b.rating);
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return result;
  }, [reviews, sort, filterRating]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Select value={sort} onValueChange={(v) => v && setSort(v as typeof sort)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filterRating}
          onValueChange={(v) => {
            if (v) {
              setFilterRating(v);
              setPage(1);
            }
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            <SelectItem value="5">5 Stars</SelectItem>
            <SelectItem value="4">4 Stars</SelectItem>
            <SelectItem value="3">3 Stars</SelectItem>
            <SelectItem value="2">2 Stars</SelectItem>
            <SelectItem value="1">1 Star</SelectItem>
          </SelectContent>
        </Select>

        <span className="ml-auto text-sm text-gray-500">
          {filtered.length} review{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-4 rounded-xl border bg-white p-6">
        {paged.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No reviews match the selected filters.
          </p>
        ) : (
          paged.map((review) => (
            <ReviewCard
              key={review.id}
              rating={review.rating}
              title={review.title}
              content={review.content}
              createdAt={review.createdAt}
              reviewerName={review.reviewerName}
              isVerified={review.isVerified}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
