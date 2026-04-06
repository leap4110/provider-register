import Link from "next/link";
import Image from "next/image";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/format";

interface BlogPostCardProps {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  authorRole: string | null;
  publishedAt: string | Date | null;
  tags: string[];
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function BlogPostCard({
  slug,
  title,
  excerpt,
  coverImage,
  authorName,
  authorRole,
  publishedAt,
  tags,
}: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video">
        {coverImage ? (
          <Image src={coverImage} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <FileText className="h-10 w-10 text-blue-300" />
          </div>
        )}
      </div>
      <div className="p-5">
        {tags[0] && (
          <Badge className="border-blue-200 bg-blue-50 text-xs text-blue-700">
            {tags[0]}
          </Badge>
        )}
        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-700">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">{excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-500">
            {getInitials(authorName)}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {authorName}
          </span>
          {authorRole && (
            <>
              <span className="text-gray-300">·</span>
              <span className="text-sm text-gray-400">{authorRole}</span>
            </>
          )}
        </div>
        {publishedAt && (
          <p className="mt-1 text-sm text-gray-400">
            {formatDate(publishedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
