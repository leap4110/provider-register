import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const provider = await db.provider.findUnique({
    where: { slug },
    include: {
      serviceOfferings: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      },
      reviews: {
        where: { isPublished: true },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      complianceActions: {
        orderBy: [{ isActive: "desc" }, { dateIssued: "desc" }],
      },
      banningOrders: { orderBy: { dateIssued: "desc" } },
      photoGallery: { orderBy: { order: "asc" } },
      categories: { include: { category: true } },
      _count: {
        select: { reviews: { where: { isPublished: true } } },
      },
    },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  const ratings = provider.reviews.map((r) => r.rating);
  const averageRating =
    ratings.length > 0
      ? Math.round(
          (ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10
        ) / 10
      : null;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: provider.reviews.filter((r) => r.rating === stars).length,
  }));

  return NextResponse.json({
    ...provider,
    averageRating,
    reviewCount: provider._count.reviews,
    ratingDistribution,
  });
}
