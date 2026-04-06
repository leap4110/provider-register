import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);

  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));

  const provider = await db.provider.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  let orderBy: Record<string, string>[] = [{ createdAt: "desc" }];
  if (sort === "highest") orderBy = [{ rating: "desc" }, { createdAt: "desc" }];
  if (sort === "lowest") orderBy = [{ rating: "asc" }, { createdAt: "desc" }];

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where: { providerId: provider.id, isPublished: true },
      include: { user: { select: { name: true } } },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.review.count({
      where: { providerId: provider.id, isPublished: true },
    }),
  ]);

  return NextResponse.json({
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
