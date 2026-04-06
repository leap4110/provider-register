"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Image,
  Briefcase,
  Inbox,
  Star,
  BarChart3,
  CreditCard,
  Users,
  Bell,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDashboardProvider } from "./DashboardContext";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: boolean;
}

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    ],
  },
  {
    label: "MANAGE",
    items: [
      { icon: Building2, label: "Company Profile", href: "/dashboard/profile" },
      { icon: Image, label: "Photos", href: "/dashboard/photos" },
      { icon: Briefcase, label: "Service Offerings", href: "/dashboard/service-offerings" },
    ],
  },
  {
    label: "LEADS",
    items: [
      { icon: Inbox, label: "Service Requests", href: "/dashboard/service-requests", badge: true },
    ],
  },
  {
    label: "REPUTATION",
    items: [
      { icon: Star, label: "Reviews", href: "/dashboard/reviews" },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
      { icon: Users, label: "Team", href: "/dashboard/team" },
      { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    ],
  },
];

const tierColors: Record<string, string> = {
  STARTER: "bg-gray-100 text-gray-700",
  ACCREDITATION_PLUS: "bg-blue-100 text-blue-700",
  ENTERPRISE: "bg-purple-100 text-purple-700",
};

const tierLabels: Record<string, string> = {
  STARTER: "Starter",
  ACCREDITATION_PLUS: "Plus",
  ENTERPRISE: "Enterprise",
};

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const provider = useDashboardProvider();

  return (
    <div className="flex h-full flex-col">
      {/* Provider Identity */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-400">
            {getInitials(provider.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">
              {provider.name}
            </p>
            <span
              className={cn(
                "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                tierColors[provider.tier] || tierColors.STARTER
              )}
            >
              {tierLabels[provider.tier] || "Starter"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && (
              <p className="px-4 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "mx-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-blue-50 font-medium text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-blue-600 text-[10px] text-white">
                      0
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t p-4">
        <Link
          href="/help"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <HelpCircle size={16} />
          Help Center
        </Link>
        <Separator className="my-2" />
        <a
          href={`/provider/${provider.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ExternalLink size={16} />
          View Profile
        </a>
      </div>
    </div>
  );
}
