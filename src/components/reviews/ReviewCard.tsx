"use client";

import { useState } from "react";
import { StarRating } from "@/components/reviews/StarRating";
import { timeAgo, formatReviewerName } from "@/lib/utils/format";

interface ReviewCardProps {
  rating: number;
  title: string | null;
  content: string;
  createdAt: string | Date;
  reviewerName: string;
  isVerified: boolean;
}

export function ReviewCard({
  rating,
  title,
  content,
  createdAt,
  reviewerName,
  isVerified,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = content.length > 300;

  return (
    <div className="border-b border-gray-100 py-5">
      <div className="flex items-center justify-between">
        <StarRating rating={rating} size="sm" />
        <span className="text-sm text-gray-400">{timeAgo(createdAt)}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-900">
          {formatReviewerName(reviewerName)}
        </span>
        {isVerified && (
          <span className="text-xs text-green-600">✓ Verified</span>
        )}
      </div>
      {title && (
        <p className="mt-3 font-medium text-gray-900">{title}</p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {isLong && !expanded ? content.slice(0, 300) + "..." : content}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 text-sm text-blue-600 hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
