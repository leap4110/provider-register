export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogTagFilter } from "@/components/blog/BlogTagFilter";

async function getPosts(tag?: string, page = 1) {
  const limit = 6;
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
  return { posts, total, totalPages: Math.ceil(total / limit) };
}

async function getTags() {
  const posts = await db.blogPost.findMany({
    where: { isPublished: true },
    select: { tags: true },
  });
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tag = params.tag;
  const page = parseInt(params.page || "1");
  const [{ posts }, tags] = await Promise.all([
    getPosts(tag, page),
    getTags(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
      <p className="mt-2 text-gray-500">
        News, guides, and stories from the NDIS community
      </p>

      <BlogTagFilter tags={tags} activeTag={tag} />

      {posts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg font-medium text-gray-700">
            {tag ? "No posts found for this topic" : "No blog posts yet"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Check back soon for new content
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <BlogPostCard
              key={post.id}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              authorName={post.authorName}
              authorRole={post.authorRole}
              publishedAt={post.publishedAt}
              tags={post.tags}
            />
          ))}
        </div>
      )}
    </div>
  );
}
