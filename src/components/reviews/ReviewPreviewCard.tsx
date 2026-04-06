import Link from "next/link";
import { StarRating } from "@/components/reviews/StarRating";

interface ReviewPreviewCardProps {
  rating: number;
  content: string;
  providerName: string;
  providerSlug: string;
  categoryName: string;
  reviewerName: string;
}

function formatReviewerName(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export function ReviewPreviewCard({
  rating,
  content,
  providerName,
  providerSlug,
  categoryName,
  reviewerName,
}: ReviewPreviewCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 transition hover:shadow-md">
      <StarRating rating={rating} size="sm" />
      <p className="mt-3 min-h-[4.5rem] text-sm leading-relaxed text-gray-700 line-clamp-3">
        {content}
      </p>
      <div className="mt-4 border-t pt-4">
        <Link
          href={`/provider/${providerSlug}`}
          className="font-medium text-gray-900 hover:text-blue-700"
        >
          {providerName}
        </Link>
        <p className="text-xs text-gray-500">{categoryName}</p>
        <p className="mt-1 text-xs text-gray-400">
          — {formatReviewerName(reviewerName)}
        </p>
      </div>
    </div>
  );
}
