"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { LocationPicker } from "@/components/search/LocationPicker";

interface Category {
  id: string;
  name: string;
  slug: string;
}

const AGE_GROUPS = [
  { label: "0–6 years", value: "0-6" },
  { label: "7–14 years", value: "7-14" },
  { label: "15–24 years", value: "15-24" },
  { label: "25–64 years", value: "25-64" },
  { label: "65+ years", value: "65+" },
];

const ACCESS_METHODS = [
  { label: "Self-managed", value: "self-managed" },
  { label: "Plan-managed", value: "plan-managed" },
  { label: "Agency-managed", value: "agency-managed" },
];

const DELIVERY_OPTIONS = [
  { label: "In-person", value: "in-person" },
  { label: "Telehealth", value: "telehealth" },
  { label: "Mobile (provider comes to you)", value: "mobile" },
];

const LANGUAGES = [
  "English",
  "Arabic",
  "Mandarin",
  "Cantonese",
  "Vietnamese",
  "Italian",
  "Greek",
  "Filipino",
  "Hindi",
  "Punjabi",
  "Spanish",
  "Korean",
  "Turkish",
  "Auslan",
  "Other",
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset page on filter change
    router.push(`/search?${params.toString()}`);
  }

  function clearAll() {
    const q = searchParams.get("q");
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`/search?${params.toString()}`);
  }

  const currentCategory = searchParams.get("category") || "";
  const currentPostcode = searchParams.get("postcode") || "";
  const currentRegistered = searchParams.get("registered") || "";
  const currentAccessMethod = searchParams.get("accessMethod") || "";
  const currentAgeGroup = searchParams.get("ageGroup") || "";
  const currentLanguage = searchParams.get("language") || "";
  const currentDelivery = searchParams.get("delivery") || "";

  return (
    <div className="space-y-1">
      {/* Category */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Service Category
        </h4>
        <Select
          value={currentCategory}
          onValueChange={(v) => updateParam("category", v === "all" ? null : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* Location */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Location
        </h4>
        <LocationPicker
          compact
          postcode={currentPostcode}
          onPostcodeChange={(v) => updateParam("postcode", v || null)}
        />
      </div>

      <Separator className="my-4" />

      {/* Registration */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Registration
        </h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={currentRegistered === "true"}
              onCheckedChange={(c) =>
                updateParam("registered", c ? "true" : null)
              }
            />
            NDIS Registered
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={currentRegistered === "false"}
              onCheckedChange={(c) =>
                updateParam("registered", c ? "false" : null)
              }
            />
            Not Registered
          </label>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Access Method */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Plan Management
        </h4>
        <div className="space-y-2">
          {ACCESS_METHODS.map((method) => (
            <label key={method.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={currentAccessMethod === method.value}
                onCheckedChange={(c) =>
                  updateParam("accessMethod", c ? method.value : null)
                }
              />
              {method.label}
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Age Group */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Age Group
        </h4>
        <div className="space-y-2">
          {AGE_GROUPS.map((group) => (
            <label key={group.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={currentAgeGroup === group.value}
                onCheckedChange={(c) =>
                  updateParam("ageGroup", c ? group.value : null)
                }
              />
              {group.label}
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Language */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Language
        </h4>
        <Select
          value={currentLanguage}
          onValueChange={(v) => updateParam("language", v === "any" ? null : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Language</SelectItem>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      {/* Service Delivery */}
      <div>
        <h4 className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-900">
          Service Delivery
        </h4>
        <div className="space-y-2">
          {DELIVERY_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={currentDelivery === option.value}
                onCheckedChange={(c) =>
                  updateParam("delivery", c ? option.value : null)
                }
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <Separator className="my-4" />

      {/* Clear all */}
      <button
        onClick={clearAll}
        className="text-sm text-red-500 hover:text-red-700"
      >
        Clear all filters
      </button>
    </div>
  );
}
