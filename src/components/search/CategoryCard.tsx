import Link from "next/link";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface CategoryCardProps {
  name: string;
  slug: string;
  icon: string;
}

export function CategoryCard({ name, slug, icon }: CategoryCardProps) {
  return (
    <Link
      href={`/search?category=${slug}`}
      className="cursor-pointer rounded-xl border p-6 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <DynamicIcon
        name={icon}
        size={32}
        className="mx-auto text-blue-600"
      />
      <p className="mt-3 font-medium text-gray-900">{name}</p>
    </Link>
  );
}
