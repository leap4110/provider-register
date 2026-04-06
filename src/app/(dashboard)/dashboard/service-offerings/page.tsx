"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Briefcase, MapPin, Users, ClipboardList, Monitor, Car, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { useDashboardProvider } from "@/components/dashboard/DashboardContext";

interface Offering {
  id: string;
  description: string | null;
  isActive: boolean;
  sa4Codes: string[];
  ageGroups: string[];
  accessMethods: string[];
  telehealth: boolean;
  mobileService: boolean;
  category: { name: string; icon: string | null };
}

const TIER_LIMITS: Record<string, number> = {
  STARTER: 3,
  ACCREDITATION_PLUS: 10,
  ENTERPRISE: 999,
};

export default function ServiceOfferingsPage() {
  const provider = useDashboardProvider();
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState(true);

  const limit = TIER_LIMITS[provider.tier] || 3;
  const atLimit = offerings.length >= limit && provider.tier !== "ENTERPRISE";

  useEffect(() => {
    fetch("/api/service-offerings")
      .then((r) => r.json())
      .then((data) => {
        setOfferings(data.offerings || []);
        setLoading(false);
      });
  }, []);

  async function toggleActive(id: string, isActive: boolean) {
    const res = await fetch(`/api/service-offerings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    if (res.ok) {
      setOfferings((prev) =>
        prev.map((o) => (o.id === id ? { ...o, isActive: !isActive } : o))
      );
    }
  }

  async function deleteOffering(id: string) {
    if (!confirm("Delete this offering? This will remove it from search results.")) return;
    const res = await fetch(`/api/service-offerings/${id}`, { method: "DELETE" });
    if (res.ok) {
      setOfferings((prev) => prev.filter((o) => o.id !== id));
      toast.success("Offering deleted");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Service Offerings</h1>
          <p className="text-sm text-gray-500">
            Manage the services you provide and where you deliver them
          </p>
        </div>
        <Link
          href="/dashboard/service-offerings/new"
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white ${
            atLimit
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={(e) => atLimit && e.preventDefault()}
        >
          <Plus size={16} />
          Add Offering
        </Link>
      </div>

      <p className="mt-2 text-sm text-gray-400">
        {offerings.length} of {provider.tier === "ENTERPRISE" ? "∞" : limit} offerings
      </p>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : offerings.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-medium text-gray-700">No service offerings yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first service offering to start appearing in search results
            </p>
            <Link
              href="/dashboard/service-offerings/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Add Offering
            </Link>
          </div>
        ) : (
          offerings.map((offering) => (
            <div
              key={offering.id}
              className="mb-4 rounded-xl border bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DynamicIcon
                    name={offering.category.icon || "help-circle"}
                    size={20}
                    className="text-blue-600"
                  />
                  <span className="font-semibold text-gray-900">
                    {offering.category.name}
                  </span>
                </div>
                <button
                  onClick={() => toggleActive(offering.id, offering.isActive)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    offering.isActive
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {offering.isActive ? "Active" : "Inactive"}
                </button>
              </div>

              {offering.description && (
                <p className="mt-2 text-sm text-gray-600 line-clamp-1">
                  {offering.description}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                {offering.sa4Codes.length > 0 && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {offering.sa4Codes.length} areas
                  </span>
                )}
                {offering.ageGroups.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {offering.ageGroups.length} age groups
                  </span>
                )}
                {offering.accessMethods.length > 0 && (
                  <span className="flex items-center gap-1">
                    <ClipboardList size={12} /> {offering.accessMethods.length} access methods
                  </span>
                )}
                {offering.telehealth && (
                  <span className="flex items-center gap-1">
                    <Monitor size={12} /> Telehealth
                  </span>
                )}
                {offering.mobileService && (
                  <span className="flex items-center gap-1">
                    <Car size={12} /> Mobile
                  </span>
                )}
              </div>

              <div className="mt-3 flex justify-end gap-2">
                <Link
                  href={`/dashboard/service-offerings/${offering.id}`}
                  className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  <Pencil size={14} /> Edit
                </Link>
                <button
                  onClick={() => deleteOffering(offering.id)}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
