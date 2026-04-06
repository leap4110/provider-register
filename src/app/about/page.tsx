import Link from "next/link";
import { ShieldCheck, Heart, Users, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "About Us — NDIS Provider Directory",
  description:
    "Learn about our mission to bring transparency and participant choice to the NDIS provider landscape.",
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Making NDIS services transparent and accessible
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            We believe every NDIS participant deserves the information they need
            to make confident choices about their support.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Our Mission
          </h2>
          <div className="prose prose-gray mt-6 max-w-none">
            <p>
              The National Disability Insurance Scheme has transformed the way
              Australians with disability access support services. But with
              thousands of registered providers across the country, finding the
              right fit can be overwhelming. Our mission is to bring
              transparency, accountability, and genuine participant choice to the
              NDIS provider landscape.
            </p>
            <p>
              We do this by giving participants and their families the tools to
              search, compare, and review NDIS providers in one place. Every
              listing includes compliance data, service details, and real
              feedback from other participants, so you can make informed
              decisions without endless phone calls and guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            What Makes Us Different
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Compliance Transparency
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We surface NDIS registration status, audit outcomes, and
                compliance history so participants can verify providers before
                engaging. No more guessing whether a provider meets quality
                standards.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100">
                <Heart className="h-6 w-6 text-rose-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Free for Everyone
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Searching, comparing, and reviewing providers is completely free
                for participants, families, and support coordinators. Access to
                information should never be a barrier to better support.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Community Driven
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Our directory is shaped by the people who use it. Participant
                reviews, ratings, and feedback drive provider rankings and help
                the community identify outstanding services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Our Story
          </h2>
          <div className="prose prose-gray mt-6 max-w-none">
            <p>
              Founded in 2026, the NDIS Provider Directory grew out of a simple
              frustration: finding reliable, high-quality disability support
              services in Australia was harder than it needed to be. As NDIS
              participants and their families, our founding team experienced
              first-hand the difficulty of navigating a fragmented provider
              landscape with limited information.
            </p>
            <p>
              We started by building a searchable database of registered
              providers and layering on real participant reviews. From there, we
              added compliance transparency, service matching, and tools for
              support coordinators. Today, we serve thousands of participants
              across every state and territory.
            </p>
            <p>
              Our team is based in Australia and includes people with lived
              experience of disability, allied health professionals, and
              technologists who are passionate about improving outcomes for NDIS
              participants. We work closely with the disability community to
              ensure the platform reflects the needs of the people it serves.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Get in Touch
          </h2>
          <p className="mt-3 text-gray-600">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
            <a
              href="mailto:hello@ndisproviders.com.au"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <Mail className="h-5 w-5" />
              hello@ndisproviders.com.au
            </a>
            <a
              href="tel:1800000123"
              className="inline-flex items-center gap-2 text-gray-700 hover:text-blue-600"
            >
              <Phone className="h-5 w-5" />
              1800 000 123
            </a>
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
