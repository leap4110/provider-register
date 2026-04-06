"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { MessageSquarePlus, MessageSquareOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: string;
  isVerified: boolean;
  user: { name: string };
}

interface ReviewsTabProps {
  providerId: string;
  providerName: string;
  providerSlug: string;
  reviews: Review[];
  averageRating: number | null;
  reviewCount: number;
  distribution: { stars: number; count: number }[];
  currentUserId?: string;
}

export function ReviewsTab({
  providerId,
  providerName,
  providerSlug,
  reviews: initialReviews,
  averageRating,
  reviewCount,
  distribution,
  currentUserId,
}: ReviewsTabProps) {
  const { data: session } = useSession();
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [reviews, setReviews] = useState(initialReviews);

  const perPage = 10;
  const hasReviewed = currentUserId
    ? reviews.some((r) => r.user.name && false) // Can't check by ID client-side, handled by API
    : false;

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") sorted.sort((a, b) => a.rating - b.rating);
    else sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted;
  }, [reviews, sort]);

  const paginatedReviews = sortedReviews.slice(
    (page - 1) * perPage,
    page * perPage
  );
  const totalPages = Math.ceil(sortedReviews.length / perPage);

  function handleWriteReview() {
    if (!session?.user) {
      setAuthDialogOpen(true);
    } else {
      setReviewFormOpen(true);
    }
  }

  async function refreshReviews() {
    try {
      const res = await fetch(
        `/api/providers/${providerSlug}/reviews?limit=100`
      );
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch {
      // fallback: keep current
    }
  }

  if (reviewCount === 0 && reviews.length === 0) {
    return (
      <div className="py-16 text-center">
        <MessageSquareOff className="mx-auto h-10 w-10 text-gray-300" />
        <h3 className="mt-3 text-lg font-medium text-gray-700">
          No reviews yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to share your experience with this provider
        </p>
        <Button
          onClick={handleWriteReview}
          className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
        >
          Write a Review
        </Button>
        <AuthDialog
          open={authDialogOpen}
          onOpenChange={setAuthDialogOpen}
          providerSlug={providerSlug}
        />
        <ReviewForm
          providerId={providerId}
          providerName={providerName}
          open={reviewFormOpen}
          onOpenChange={setReviewFormOpen}
          onSuccess={refreshReviews}
        />
      </div>
    );
  }

  return (
    <div>
      {averageRating && (
        <ReviewSummary
          averageRating={averageRating}
          reviewCount={reviewCount}
          distribution={distribution}
        />
      )}

      <div className="mt-6">
        <Button variant="outline" onClick={handleWriteReview}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          Write a review
        </Button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews</h3>
        <Select value={sort} onValueChange={(v) => v && setSort(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Most Recent</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-2">
        {paginatedReviews.map((review) => (
          <ReviewCard
            key={review.id}
            rating={review.rating}
            title={review.title}
            content={review.content}
            createdAt={review.createdAt}
            reviewerName={review.user.name}
            isVerified={review.isVerified}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        providerSlug={providerSlug}
      />
      <ReviewForm
        providerId={providerId}
        providerName={providerName}
        open={reviewFormOpen}
        onOpenChange={setReviewFormOpen}
        onSuccess={refreshReviews}
      />
    </div>
  );
}

function AuthDialog({
  open,
  onOpenChange,
  providerSlug,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providerSlug: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Sign in to leave a review</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Create a free account or sign in to submit a review.
        </p>
        <DialogFooter className="gap-2">
          <Link
            href={`/login?redirect=/provider/${providerSlug}`}
            className="inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-gray-50"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
