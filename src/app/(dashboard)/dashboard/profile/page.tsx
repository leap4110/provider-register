"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardProvider } from "@/components/dashboard/DashboardContext";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1),
  abn: z.string().optional(),
  description: z.string().max(2000).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  address: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  hideExactAddress: z.boolean().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"];

export default function ProfilePage() {
  const provider = useDashboardProvider();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const description = watch("description") || "";

  useEffect(() => {
    fetch(`/api/providers/${provider.slug}`)
      .then((r) => r.json())
      .then((data) => {
        reset({
          name: data.name || "",
          slug: data.slug || "",
          abn: data.abn || "",
          description: data.description || "",
          email: data.email || "",
          phone: data.phone || "",
          website: data.website || "",
          address: data.address || "",
          suburb: data.suburb || "",
          state: data.state || "",
          postcode: data.postcode || "",
          hideExactAddress: data.hideExactAddress || false,
        });
        setLoading(false);
      });
  }, [provider.slug, reset]);

  async function onSubmit(data: ProfileFormData) {
    const res = await fetch(`/api/providers/${provider.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Profile updated successfully");
    } else {
      const body = await res.json();
      toast.error(body.error || "Failed to update profile");
    }
  }

  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Company Profile</h1>
      <p className="text-sm text-gray-500">
        Manage how your business appears on the directory
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Provider Name *</Label>
              <Input id="name" {...register("name")} className="mt-1" />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="slug">Custom URL</Label>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm text-gray-500">
                  /provider/
                </span>
                <Input id="slug" {...register("slug")} className="flex-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="abn">ABN</Label>
              <Input
                id="abn"
                inputMode="numeric"
                maxLength={14}
                {...register("abn")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={6}
                maxLength={2000}
                placeholder="Describe your services, experience, and what makes you different"
                {...register("description")}
                className="mt-1"
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {description.length} / 2000
              </p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Contact Details
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="04XX XXX XXX" {...register("phone")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" placeholder="https://www.example.com.au" {...register("website")} className="mt-1" />
            </div>
            {provider.tier === "STARTER" && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Info size={12} />
                Phone and email are only displayed with Plus or Enterprise plans.
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Location
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="Street address" {...register("address")} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="suburb">Suburb</Label>
                <Input id="suburb" {...register("suburb")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  value={watch("state") || ""}
                  onValueChange={(v) => v && setValue("state", v, { shouldDirty: true })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="postcode">Postcode</Label>
              <Input
                id="postcode"
                inputMode="numeric"
                maxLength={4}
                {...register("postcode")}
                className="mt-1 w-32"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={watch("hideExactAddress") || false}
                onCheckedChange={(c) =>
                  setValue("hideExactAddress", c === true, { shouldDirty: true })
                }
              />
              Hide exact address on public profile
            </label>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="h-11 bg-blue-600 px-8 font-medium text-white hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
