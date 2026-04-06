"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const offeringSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional(),
  ageGroups: z.array(z.string()).min(1, "Select at least one age group"),
  accessMethods: z.array(z.string()).min(1, "Select at least one access method"),
  languages: z.array(z.string()),
  availableDays: z.array(z.string()),
  telehealth: z.boolean(),
  mobileService: z.boolean(),
});

type OfferingFormData = z.infer<typeof offeringSchema>;

const AGE_GROUPS = ["0-6", "7-14", "15-24", "25-64", "65+"];
const ACCESS_METHODS = ["Self-managed", "Plan-managed", "Agency-managed"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const LANGUAGES = [
  "English", "Arabic", "Mandarin", "Cantonese", "Vietnamese", "Italian",
  "Greek", "Filipino", "Hindi", "Punjabi", "Spanish", "Korean", "Turkish", "Auslan",
];

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function OfferingEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OfferingFormData>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      categoryId: "",
      description: "",
      ageGroups: [],
      accessMethods: [],
      languages: ["English"],
      availableDays: [],
      telehealth: false,
      mobileService: false,
    },
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));

    if (!isNew) {
      fetch(`/api/service-offerings/${id}`)
        .then((r) => r.json())
        .then((data) => {
          reset({
            categoryId: data.categoryId || "",
            description: data.description || "",
            ageGroups: data.ageGroups || [],
            accessMethods: data.accessMethods || [],
            languages: data.languages || ["English"],
            availableDays: data.availableDays || [],
            telehealth: data.telehealth || false,
            mobileService: data.mobileService || false,
          });
          setLoading(false);
        });
    }
  }, [id, isNew, reset]);

  function toggleArrayValue(field: keyof OfferingFormData, value: string) {
    const current = (watch(field) as string[]) || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldDirty: true });
  }

  async function onSubmit(data: OfferingFormData) {
    const url = isNew ? "/api/service-offerings" : `/api/service-offerings/${id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(isNew ? "Offering created" : "Offering updated");
      router.push("/dashboard/service-offerings");
    } else {
      const body = await res.json();
      toast.error(body.error || "Something went wrong");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this offering? This cannot be undone.")) return;
    const res = await fetch(`/api/service-offerings/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Offering deleted");
      router.push("/dashboard/service-offerings");
    }
  }

  if (loading) return <div className="py-8 text-center text-gray-500">Loading...</div>;

  return (
    <div>
      <Link
        href="/dashboard/service-offerings"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to offerings
      </Link>

      <h1 className="text-xl font-bold text-gray-900">
        {isNew ? "New Service Offering" : "Edit Service Offering"}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-6">
        {/* Service Type */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">Service Type</h2>
          <div>
            <Label>Category *</Label>
            <Select
              value={watch("categoryId")}
              onValueChange={(v) => v && setValue("categoryId", v, { shouldDirty: true })}
              disabled={!isNew}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>
          <div className="mt-4">
            <Label>Description</Label>
            <Textarea
              rows={3}
              maxLength={500}
              placeholder="Describe how you deliver this service..."
              {...register("description")}
              className="mt-1"
            />
          </div>
        </div>

        {/* Who Can You Support */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">Who can you support?</h2>
          <div className="space-y-4">
            <div>
              <Label>Age Groups *</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {AGE_GROUPS.map((g) => (
                  <label key={g} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={(watch("ageGroups") || []).includes(g)}
                      onCheckedChange={() => toggleArrayValue("ageGroups", g)}
                    />
                    {g} years
                  </label>
                ))}
              </div>
              {errors.ageGroups && (
                <p className="mt-1 text-sm text-red-600">{errors.ageGroups.message}</p>
              )}
            </div>
            <div>
              <Label>Access Methods *</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {ACCESS_METHODS.map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={(watch("accessMethods") || []).includes(m)}
                      onCheckedChange={() => toggleArrayValue("accessMethods", m)}
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label>Languages</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {LANGUAGES.map((l) => (
                  <label key={l} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={(watch("languages") || []).includes(l)}
                      onCheckedChange={() => toggleArrayValue("languages", l)}
                    />
                    {l}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Delivery */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">How do you deliver this service?</h2>
          <div className="space-y-4">
            <div>
              <Label>Available Days</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {DAYS.map((d) => (
                  <label key={d} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={(watch("availableDays") || []).includes(d)}
                      onCheckedChange={() => toggleArrayValue("availableDays", d)}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={watch("telehealth") || false}
                onCheckedChange={(c) => setValue("telehealth", c === true, { shouldDirty: true })}
              />
              Telehealth available
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={watch("mobileService") || false}
                onCheckedChange={(c) => setValue("mobileService", c === true, { shouldDirty: true })}
              />
              Mobile service (you travel to the participant)
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 bg-blue-600 px-6 text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
            ) : (
              "Save Offering"
            )}
          </Button>
          <Link
            href="/dashboard/service-offerings"
            className="inline-flex h-11 items-center px-4 text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </Link>
        </div>

        {!isNew && (
          <>
            <Separator className="mt-8" />
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-red-600">Danger Zone</h3>
              <p className="mt-1 text-sm text-gray-500">
                Permanently delete this service offering
              </p>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mt-3"
              >
                Delete Offering
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
