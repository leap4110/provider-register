"use client";

import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardProvider } from "@/components/dashboard/DashboardContext";

interface PlanFeature {
  label: string;
  starter: boolean;
  plus: boolean;
  enterprise: boolean;
}

const features: PlanFeature[] = [
  { label: "Directory listing", starter: true, plus: true, enterprise: true },
  { label: "Service area management", starter: true, plus: true, enterprise: true },
  { label: "Review collection", starter: true, plus: true, enterprise: true },
  { label: "Service request matching", starter: true, plus: true, enterprise: true },
  { label: "Phone & email on profile", starter: false, plus: true, enterprise: true },
  { label: "Photo gallery", starter: false, plus: true, enterprise: true },
  { label: "Analytics dashboard", starter: false, plus: true, enterprise: true },
  { label: "Accreditation badge", starter: false, plus: true, enterprise: true },
  { label: "Priority search placement", starter: false, plus: false, enterprise: true },
  { label: "Dedicated account manager", starter: false, plus: false, enterprise: true },
  { label: "API access", starter: false, plus: false, enterprise: true },
  { label: "Custom branding", starter: false, plus: false, enterprise: true },
];

const plans = [
  {
    id: "STARTER" as const,
    name: "Starter",
    price: 59,
    description: "Get listed and start receiving enquiries",
    featureKey: "starter" as const,
  },
  {
    id: "ACCREDITATION_PLUS" as const,
    name: "Accreditation Plus",
    price: 99,
    description: "Stand out with verified accreditation and full features",
    featureKey: "plus" as const,
    popular: true,
  },
  {
    id: "ENTERPRISE" as const,
    name: "Enterprise",
    price: 199,
    description: "For large providers who need priority placement and support",
    featureKey: "enterprise" as const,
  },
];

export default function BillingPage() {
  const { tier } = useDashboardProvider();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Billing &amp; Plans</h1>
      <p className="text-sm text-gray-500">
        Manage your subscription and compare available plans
      </p>

      <div className="mt-6 rounded-xl border bg-white p-6">
        <p className="text-sm text-gray-500">Current Plan</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {tier === "ACCREDITATION_PLUS"
            ? "Accreditation Plus"
            : tier === "ENTERPRISE"
              ? "Enterprise"
              : "Starter"}
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = tier === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border bg-white p-6 ${
                isCurrent ? "border-2 border-blue-500" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2.5 left-4 bg-blue-600 text-white hover:bg-blue-600">
                  Most Popular
                </Badge>
              )}

              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="mt-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>

              <ul className="mt-6 space-y-3">
                {features.map((feature) => {
                  const included = feature[plan.featureKey];
                  return (
                    <li key={feature.label} className="flex items-center gap-2">
                      {included ? (
                        <Check className="h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          included ? "text-gray-700" : "text-gray-400"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6">
                {isCurrent ? (
                  <Button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 hover:bg-gray-100"
                  >
                    Current Plan
                  </Button>
                ) : (
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    {tier === "ENTERPRISE"
                      ? "Downgrade"
                      : plans.indexOf(plan) >
                          plans.findIndex((p) => p.id === tier)
                        ? "Upgrade"
                        : "Downgrade"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Stripe integration pending &mdash; plan changes are not functional yet.
      </p>
    </div>
  );
}
