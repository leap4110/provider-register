export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight, BarChart3, Handshake, Search, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { CategoryCard } from "@/components/search/CategoryCard";
import { ReviewPreviewCard } from "@/components/reviews/ReviewPreviewCard";
import { HeroSearch } from "@/components/search/HeroSearch";

async function getCategories() {
  return db.serviceCategory.findMany({
    take: 8,
    orderBy: { name: "asc" },
  });
}

async function getRecentReviews() {
  return db.review.findMany({
    where: { isPublished: true },
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      provider: {
        select: { name: true, slug: true },
        },
      user: {
        select: { name: true },
      },
    },
  });
}

export default async function Home() {
  const [categories, reviews] = await Promise.all([
    getCategories(),
    getRecentReviews(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 px-4 py-20 text-center md:py-32">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Find the right NDIS service for you
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            With ratings &amp; reviews you can trust
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Browse by service type
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Find the support you need
          </p>
          <div className="mb-10 mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon || "help-circle"}
              />
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
            >
              View all categories
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            How it works
          </h2>
          <p className="mt-2 text-center text-gray-500">
            Finding disability support made simple
          </p>
          <div className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                1
              </div>
              <Search className="mx-auto mt-4 text-blue-600" size={28} />
              <h3 className="mt-4 text-lg font-semibold">Search</h3>
              <p className="mt-2 text-sm text-gray-500">
                Search for NDIS services by category, location, or keyword
              </p>
            </div>
            {/* Arrow 1 */}
            <div className="absolute left-[28%] top-6 hidden md:block">
              <ChevronRight className="h-6 w-6 text-gray-300" />
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                2
              </div>
              <BarChart3 className="mx-auto mt-4 text-blue-600" size={28} />
              <h3 className="mt-4 text-lg font-semibold">Compare</h3>
              <p className="mt-2 text-sm text-gray-500">
                Read reviews and ratings from real participants to compare
                providers
              </p>
            </div>
            {/* Arrow 2 */}
            <div className="absolute left-[61%] top-6 hidden md:block">
              <ChevronRight className="h-6 w-6 text-gray-300" />
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                3
              </div>
              <Handshake className="mx-auto mt-4 text-blue-600" size={28} />
              <h3 className="mt-4 text-lg font-semibold">Connect</h3>
              <p className="mt-2 text-sm text-gray-500">
                Submit a service request and we&apos;ll connect you with matched
                providers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            What participants are saying
          </h2>
          <div className="mt-10">
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewPreviewCard
                    key={review.id}
                    rating={review.rating}
                    content={review.content}
                    providerName={review.provider.name}
                    providerSlug={review.provider.slug}
                    categoryName=""
                    reviewerName={review.user.name}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Be the first to leave a review!{" "}
                <Link href="/search" className="text-blue-600 hover:underline">
                  Find a provider
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="bg-blue-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Are you an NDIS provider?
          </h2>
          <p className="mt-3 text-gray-600">
            Reach thousands of participants looking for services like yours
          </p>
          <Link
            href="/providers"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-8 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Get Listed
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
