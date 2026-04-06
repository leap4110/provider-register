import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Badge } from "@/components/ui/badge";
import { NavigatorCTA } from "@/components/navigator/NavigatorCTA";

// Dynamic import for navigator content — the data file may be large
async function getNavigatorContent(slug: string) {
  try {
    const { navigatorContent } = await import("@/data/navigator-content");
    return navigatorContent[slug] || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.serviceCategory.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found" };

  const content = await getNavigatorContent(slug);
  const description = content?.whatIsIt?.substring(0, 160) ||
    `Learn about ${category.name} services under the NDIS.`;

  return {
    title: `${category.name} — NDIS Navigator`,
    description,
  };
}

export default async function NavigatorCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await db.serviceCategory.findUnique({ where: { slug } });
  if (!category) notFound();

  const content = await getNavigatorContent(slug);

  // Find related categories from the database
  const relatedSlugs = content?.relatedCategories || [];
  const relatedCategories = relatedSlugs.length > 0
    ? await db.serviceCategory.findMany({
        where: { slug: { in: relatedSlugs } },
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/ndis-navigator"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to NDIS Navigator
      </Link>

      <div className="mt-6 flex items-center gap-4">
        <DynamicIcon
          name={category.icon || "help-circle"}
          size={40}
          className="text-blue-600"
        />
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
      </div>

      {content ? (
        <div className="mt-8 space-y-8">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              What is {category.name}?
            </h2>
            <p className="leading-relaxed text-gray-700">{content.whatIsIt}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Who is it for?
            </h2>
            <p className="leading-relaxed text-gray-700">{content.whoIsItFor}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              What to expect
            </h2>
            <p className="leading-relaxed text-gray-700">
              {content.whatToExpect}
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              How is it funded under the NDIS?
            </h2>
            <p className="leading-relaxed text-gray-700">
              {content.ndisFunding}
            </p>
          </section>
        </div>
      ) : (
        <p className="mt-8 italic text-gray-400">
          Content for this service is being prepared. Check back soon.
        </p>
      )}

      {/* Search CTA */}
      <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="font-semibold text-gray-900">
          Find {category.name} providers near you
        </h3>
        <NavigatorCTA categorySlug={category.slug} categoryName={category.name} />
      </div>

      {/* Related Services */}
      {relatedCategories.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Related Services
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((rc) => (
              <Link key={rc.id} href={`/ndis-navigator/${rc.slug}`}>
                <Badge className="gap-1.5 border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-100">
                  <DynamicIcon name={rc.icon || "help-circle"} size={14} />
                  {rc.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
