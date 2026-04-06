import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import { formatDate } from "@/lib/utils/format";

async function getPost(slug: string) {
  return db.blogPost.findUnique({
    where: { slug, isPublished: true },
  });
}

async function getRelated(postId: string, tags: string[]) {
  return db.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: postId },
      ...(tags.length > 0 ? { tags: { hasSome: tags } } : {}),
    },
    take: 2,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — NDIS Directory Blog`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = await getRelated(post.id, post.tags);
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/blog"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to Blog
      </Link>

      {post.tags.length > 0 && (
        <div className="mt-4 flex gap-2">
          {post.tags.map((tag) => (
            <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
              <Badge className="border-blue-200 bg-blue-50 text-xs text-blue-700">
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <h1 className="mt-4 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
        {post.title}
      </h1>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-500">
          {getInitials(post.authorName)}
        </div>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-900">
              {post.authorName}
            </span>
            {post.authorRole && (
              <>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">{post.authorRole}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {post.publishedAt && formatDate(post.publishedAt)}
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>

      {post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <article
        className="prose prose-gray prose-lg mt-8 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-8 border-t pt-6">
        <BlogShareButtons title={post.title} />
      </div>

      {related.length > 0 && (
        <div className="mt-8 border-t pt-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {related.map((r) => (
              <BlogPostCard
                key={r.id}
                slug={r.slug}
                title={r.title}
                excerpt={r.excerpt}
                coverImage={r.coverImage}
                authorName={r.authorName}
                authorRole={r.authorRole}
                publishedAt={r.publishedAt}
                tags={r.tags}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
