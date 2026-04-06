export const dynamic = "force-dynamic";

import Link from "next/link";
import { ChevronRight, BarChart3, Handshake, Search, ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import { CategoryCard } from "@/components/search/CategoryCard";
import { ReviewPreviewCard } from "@/components/reviews/ReviewPreviewCard";
import { HeroSearch } from "@/components/search/HeroSearch";
import { AnimatedHero } from "@/components/home/AnimatedHero";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { StaggerChildren } from "@/components/animations/StaggerChildren";

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
      {/* Hero — animated on initial load */}
      <AnimatedHero>
        <HeroSearch />
      </AnimatedHero>

      {/* Popular Categories */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
              Browse by service type
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Find the support you need
            </p>
          </ScrollReveal>
          <StaggerChildren
            staggerDelay={0.06}
            direction="up"
            className="mb-10 mt-10 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                slug={cat.slug}
                icon={cat.icon || "help-circle"}
              />
            ))}
          </StaggerChildren>
          <ScrollReveal direction="up" delay={0.2}>
            <div className="text-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                View all categories
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal direction="up">
            <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
              How it works
            </h2>
            <p className="mt-2 text-center text-gray-500">
              Finding disability support made simple
            </p>
          </ScrollReveal>
          <StaggerChildren
            staggerDelay={0.15}
            direction="up"
            className="relative mt-12 grid grid-cols-1 gap-8 md:grid-cols-3"
          >
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
          </StaggerChildren>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal direction="up">
            <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
              What participants are saying
            </h2>
          </ScrollReveal>
          <div className="mt-10">
            {reviews.length > 0 ? (
              <StaggerChildren
                staggerDelay={0.12}
                direction="up"
                className="grid grid-cols-1 gap-6 md:grid-cols-3"
              >
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
              </StaggerChildren>
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
      <ScrollReveal direction="up">
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
      </ScrollReveal>
    </div>
  );
}
