import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const tags = Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ tags });
}
