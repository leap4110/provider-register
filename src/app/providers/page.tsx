import Link from "next/link";
import {
  Search,
  ShieldCheck,
  MessageSquare,
  LayoutDashboard,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "For Providers — NDIS Provider Directory",
  description:
    "Grow your NDIS business. Get listed, build trust, and connect with participants looking for your services.",
};

const benefits = [
  {
    icon: Search,
    title: "Be Found",
    description:
      "Appear in search results when participants and support coordinators look for services in your area and category.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Build Trust",
    description:
      "Showcase your NDIS registration, compliance record, and verified reviews to build credibility with prospective clients.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: MessageSquare,
    title: "Get Leads",
    description:
      "Receive service requests from matched participants who are actively looking for the services you offer.",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: LayoutDashboard,
    title: "Showcase Services",
    description:
      "Create detailed service offerings with descriptions, pricing, photos, and availability to stand out from the competition.",
    color: "bg-amber-100 text-amber-600",
  },
];

const plans = [
  {
    name: "Starter",
    price: 59,
    description: "Get listed and start receiving enquiries.",
    popular: false,
    features: [
      { text: "Business profile listing", included: true },
      { text: "Up to 3 service offerings", included: true },
      { text: "Participant reviews", included: true },
      { text: "Basic analytics", included: true },
      { text: "Service request matching", included: false },
      { text: "Priority search ranking", included: false },
      { text: "Compliance badge", included: false },
      { text: "Team member accounts", included: false },
    ],
  },
  {
    name: "Accreditation Plus",
    price: 99,
    description: "Stand out with compliance transparency and matching.",
    popular: true,
    features: [
      { text: "Business profile listing", included: true },
      { text: "Unlimited service offerings", included: true },
      { text: "Participant reviews", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "Service request matching", included: true },
      { text: "Priority search ranking", included: true },
      { text: "Compliance badge", included: true },
      { text: "Up to 3 team members", included: false },
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    description: "Everything you need to scale your NDIS business.",
    popular: false,
    features: [
      { text: "Business profile listing", included: true },
      { text: "Unlimited service offerings", included: true },
      { text: "Participant reviews", included: true },
      { text: "Full analytics dashboard", included: true },
      { text: "Service request matching", included: true },
      { text: "Priority search ranking", included: true },
      { text: "Compliance badge", included: true },
      { text: "Unlimited team members", included: true },
    ],
  },
];

const faqs = [
  {
    question: "How long does it take to get listed?",
    answer:
      "Once you create your account and complete your profile, your listing goes live within 24 hours after our team verifies your NDIS registration details.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes. You can upgrade or downgrade your plan at any time from your dashboard. Changes take effect at the start of your next billing cycle.",
  },
  {
    question: "Is there a contract or lock-in period?",
    answer:
      "No. All plans are billed monthly and you can cancel at any time. There are no setup fees or cancellation penalties.",
  },
  {
    question: "What information do I need to get started?",
    answer:
      "You will need your NDIS registration number, ABN, business contact details, and descriptions of the services you provide. Photos and additional documentation are optional but recommended.",
  },
  {
    question: "How do service requests work?",
    answer:
      "Participants submit service requests describing their needs. Our matching engine identifies suitable providers based on category, location, and availability. Matched providers receive the request and can respond with their availability and service details.",
  },
  {
    question: "Do you charge participants?",
    answer:
      "No. The platform is completely free for NDIS participants, their families, and support coordinators. Only providers pay for listing and premium features.",
  },
];

export default function ProvidersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            Grow Your NDIS Business
          </h1>
          <p className="mt-4 text-lg text-blue-100 md:text-xl">
            Join thousands of providers using our directory to reach
            participants, build trust, and grow their services.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-8 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Why List With Us
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Everything you need to attract and retain NDIS participants.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-100 p-6"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${benefit.color}`}
                >
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Choose the plan that fits your business. No hidden fees.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border bg-white p-6 ${
                  plan.popular
                    ? "border-blue-600 ring-2 ring-blue-600"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm text-gray-500">/month</span>
                </div>
                <Link
                  href="/register"
                  className={`mt-6 flex h-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Get Started
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.text}
                      className="flex items-start gap-2 text-sm"
                    >
                      {feature.included ? (
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      ) : (
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                      )}
                      <span
                        className={
                          feature.included ? "text-gray-700" : "text-gray-400"
                        }
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-gray-900 marker:[content:''] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="ml-2 shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4 6l4 4 4-4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Ready to Reach More Participants?
          </h2>
          <p className="mt-3 text-blue-100">
            Create your account today and start connecting with NDIS
            participants in your area.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-white px-8 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Create Your Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
