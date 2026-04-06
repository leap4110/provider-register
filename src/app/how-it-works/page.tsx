import Link from "next/link";
import { Search, BarChart3, Handshake, ArrowRight } from "lucide-react";

export const metadata = {
  title: "How It Works — NDIS Provider Directory",
  description:
    "Learn how to search, compare, and connect with NDIS service providers through our directory.",
};

export default function HowItWorksPage() {
  return (
    <div>
      {/* Heading */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            How It Works
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Finding the right NDIS provider doesn&apos;t have to be complicated.
            Our platform guides you through three simple steps.
          </p>
        </div>
      </section>

      {/* Step 1 — Search */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-blue-100">
              <Search className="h-16 w-16 text-blue-600" />
            </div>
          </div>
          <div>
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Search for Services
            </h2>
            <div className="prose prose-gray mt-4 max-w-none">
              <p>
                Start by searching for the type of support you need. You can
                browse by service category, such as daily living assistance,
                therapy services, or plan management. Use filters to narrow
                results by location, availability, language, and more.
              </p>
              <p>
                Our search engine considers your suburb or postcode and surfaces
                providers in your area first. If you are looking for something
                specific, keyword search lets you find providers by name or
                specialty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2 — Compare */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Compare and Research
            </h2>
            <div className="prose prose-gray mt-4 max-w-none">
              <p>
                Once you have a list of potential providers, dive deeper into
                each one. Every provider profile includes verified NDIS
                registration details, service descriptions, pricing guidance, and
                photos of their facilities.
              </p>
              <p>
                Most importantly, you can read reviews and ratings from other
                NDIS participants. Real experiences from real people help you
                understand what to expect. Our compliance transparency feature
                shows each provider&apos;s registration status and audit history,
                giving you extra confidence in your choice.
              </p>
            </div>
          </div>
          <div className="order-1 flex items-center justify-center md:order-2">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-emerald-100">
              <BarChart3 className="h-16 w-16 text-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Step 3 — Connect */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-violet-100">
              <Handshake className="h-16 w-16 text-violet-600" />
            </div>
          </div>
          <div>
            <div className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              3
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Connect with Providers
            </h2>
            <div className="prose prose-gray mt-4 max-w-none">
              <p>
                Ready to take the next step? Submit a service request describing
                your needs, and our matching engine will connect you with
                suitable providers in your area. Providers receive your request
                and can respond with availability and service details.
              </p>
              <p>
                You can also contact providers directly through their profile
                page. Whether you prefer a phone call, email, or the in-platform
                service request system, the choice is yours. There is no cost to
                participants for using the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Ready to find a provider?
          </h2>
          <p className="mt-3 text-gray-600">
            Start searching today and discover NDIS providers near you.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-8 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Search Providers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
