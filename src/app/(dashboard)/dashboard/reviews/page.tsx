import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ReviewSummary } from "@/components/reviews/ReviewSummary";
import { ReviewsClient } from "./ReviewsClient";

export default async function ReviewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const member = await db.providerMember.findUnique({
    where: { userId: session.user.id },
    select: { providerId: true },
  });

  if (!member) redirect("/dashboard");

  const reviews = await db.review.findMany({
    where: { providerId: member.providerId, isPublished: true },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));

  const serializedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    content: r.content,
    createdAt: r.createdAt.toISOString(),
    reviewerName: r.user.name,
    isVerified: r.isVerified,
  }));

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
      <p className="text-sm text-gray-500">
        See what participants are saying about your services
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <ReviewSummary
          averageRating={averageRating}
          reviewCount={reviewCount}
          distribution={distribution}
        />
      </div>

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Reviews are submitted by verified participants and cannot be edited or
        removed by providers. If you believe a review violates our guidelines,
        please contact support.
      </div>

      <div className="mt-6">
        <ReviewsClient reviews={serializedReviews} />
      </div>
    </div>
  );
}
