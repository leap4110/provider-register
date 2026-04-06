"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/connect", label: "Find Providers" },
  { href: "/connect/referrals", label: "My Referrals" },
  { href: "/connect/request", label: "Submit Request" },
];

export function CoordinatorBar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <div className="border-b border-indigo-200 bg-indigo-50 px-4 py-2">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-indigo-700">
            <Compass size={16} />
            Support Coordinator Tools
          </div>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "rounded-md px-3 py-1 text-sm transition-colors",
                  pathname === tab.href
                    ? "bg-indigo-100 font-medium text-indigo-800"
                    : "text-indigo-600 hover:bg-indigo-100"
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>
        <span className="hidden text-sm text-gray-500 sm:block">
          Logged in as {userName}
        </span>
      </div>
    </div>
  );
}
