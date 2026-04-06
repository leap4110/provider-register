import Link from "next/link";
import { Search, Building, Shield } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Find the Right NDIS Provider
          </h1>
          <p className="mb-8 text-lg text-gray-600">
            Search and connect with trusted NDIS service providers across
            Australia. Compare services, read reviews, and find the support you
            need.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-base font-medium text-white transition-colors hover:bg-blue-700"
            >
              Search Providers
            </Link>
            <Link
              href="/register"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-8 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              List Your Service
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Search &amp; Compare
            </h3>
            <p className="text-sm text-gray-600">
              Browse providers by service type, location, and specialisation to
              find your perfect match.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Verified Providers
            </h3>
            <p className="text-sm text-gray-600">
              Check NDIS registration status, compliance history, and real
              participant reviews.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Connect Directly
            </h3>
            <p className="text-sm text-gray-600">
              Submit service requests and let matching providers come to you with
              personalised quotes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
