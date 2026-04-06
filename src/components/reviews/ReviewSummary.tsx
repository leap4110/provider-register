import { StarRating } from "@/components/reviews/StarRating";

interface ReviewSummaryProps {
  averageRating: number;
  reviewCount: number;
  distribution: { stars: number; count: number }[];
}

export function ReviewSummary({
  averageRating,
  reviewCount,
  distribution,
}: ReviewSummaryProps) {
  const maxCount = Math.max(...distribution.map((d) => d.count), 1);

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row">
      <div className="text-center">
        <p className="text-4xl font-bold text-gray-900">
          {averageRating.toFixed(1)}
        </p>
        <StarRating rating={averageRating} size="lg" />
        <p className="mt-1 text-sm text-gray-500">
          Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 space-y-1.5">
        {distribution.map(({ stars, count }) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-8 text-sm text-gray-600">{stars} ★</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${(count / maxCount) * 100}%` }}
              />
            </div>
            <span className="w-8 text-right text-sm text-gray-500">
              ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
