import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await db.blogPost.findUnique({
    where: { slug, isPublished: true },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Find related posts (same tags or most recent)
  const related = await db.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
      ...(post.tags.length > 0
        ? { tags: { hasSome: post.tags } }
        : {}),
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ post, related });
}
