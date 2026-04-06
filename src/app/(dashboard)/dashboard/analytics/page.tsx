"use client";

import Link from "next/link";
import { BarChart3, Eye, Search, MousePointerClick } from "lucide-react";
import { useDashboardProvider } from "@/components/dashboard/DashboardContext";

export default function AnalyticsPage() {
  const { tier } = useDashboardProvider();

  if (tier === "STARTER") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Track your profile performance, search appearances, and participant
          engagement. Upgrade to Accreditation Plus or Enterprise to unlock
          analytics.
        </p>
        <Link
          href="/dashboard/billing"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Plans
        </Link>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Views",
      value: "1,247",
      change: "+12%",
      icon: Eye,
    },
    {
      label: "Search Appearances",
      value: "3,892",
      change: "+8%",
      icon: Search,
    },
    {
      label: "Conversion Rate",
      value: "4.2%",
      change: "+0.3%",
      icon: MousePointerClick,
    },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
      <p className="text-sm text-gray-500">
        Track your profile performance and engagement
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <span className="text-xs font-medium text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="flex h-72 items-center justify-center rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-400">
            Chart requires Recharts &mdash; coming soon
          </p>
        </div>
        <div className="flex h-72 items-center justify-center rounded-xl border bg-white p-6">
          <p className="text-sm text-gray-400">
            Chart requires Recharts &mdash; coming soon
          </p>
        </div>
      </div>
    </div>
  );
}
