import Link from "next/link";
import { Search } from "lucide-react";
import { db } from "@/lib/db";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "NDIS Navigator — Learn About NDIS Services",
  description:
    "Explore NDIS service types and learn what to expect. Find the right disability support for your needs.",
};

export default async function NDISNavigatorPage() {
  const categories = await db.serviceCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">NDIS Navigator</h1>
      <p className="mt-2 text-gray-500">
        Learn about NDIS services and find the right support
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/ndis-navigator/${cat.slug}`}
            className="group rounded-xl border p-6 text-center transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
          >
            <DynamicIcon
              name={cat.icon || "help-circle"}
              size={32}
              className="mx-auto text-blue-600"
            />
            <p className="mt-3 font-medium text-gray-900">{cat.name}</p>
            <p className="mt-1 text-sm text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
              Learn more →
            </p>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-lg rounded-xl border bg-gray-50 p-6 text-center">
        <Search className="mx-auto h-8 w-8 text-gray-400" />
        <h3 className="mt-3 font-semibold text-gray-900">
          Can&apos;t find what you&apos;re looking for?
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Search our full provider directory
        </p>
        <Link
          href="/search"
          className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Search Providers →
        </Link>
      </div>
    </div>
  );
}
