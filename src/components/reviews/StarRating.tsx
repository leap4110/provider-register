"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
}

const sizeMap = {
  sm: { star: "w-3.5 h-3.5", gap: "gap-0.5" },
  md: { star: "w-[18px] h-[18px]", gap: "gap-0.5" },
  lg: { star: "w-6 h-6", gap: "gap-1" },
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
}: StarRatingProps) {
  const { star: starSize, gap } = sizeMap[size];

  return (
    <div className={cn("flex items-center", gap)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const position = i + 1;
        const isFilled = rating >= position;
        const isHalf = !isFilled && rating >= position - 0.5;

        const starElement = (
          <span key={position} className="relative inline-flex">
            {/* Background (empty) star */}
            <Star className={cn(starSize, "text-gray-300")} />
            {/* Filled overlay */}
            {(isFilled || isHalf) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: isFilled ? "100%" : "50%" }}
              >
                <Star
                  className={cn(starSize, "text-amber-400")}
                  fill="currentColor"
                />
              </span>
            )}
          </span>
        );

        if (interactive) {
          return (
            <button
              key={position}
              type="button"
              onClick={() => onRatingChange?.(position)}
              className="cursor-pointer"
            >
              {starElement}
            </button>
          );
        }

        return starElement;
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-900">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
