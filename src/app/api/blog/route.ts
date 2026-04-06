import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") || "6"));

  const where = {
    isPublished: true,
    ...(tag ? { tags: { has: tag } } : {}),
  };

  const [posts, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.blogPost.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
