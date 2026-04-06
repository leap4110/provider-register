"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ChevronRight,
  ChevronLeft,
  Send,
  Loader2,
  CheckCircle2,
  Lock,
  Info,
} from "lucide-react";
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
import { LocationPicker } from "@/components/search/LocationPicker";
import Link from "next/link";

const STEPS = ["Service", "Location", "About You", "Review & Submit"];

const AGE_GROUPS = [
  { value: "0-6", label: "0–6 years (Early childhood)" },
  { value: "7-14", label: "7–14 years" },
  { value: "15-24", label: "15–24 years" },
  { value: "25-64", label: "25–64 years" },
  { value: "65+", label: "65+ years" },
];

const ACCESS_METHODS = [
  { value: "self-managed", label: "Self-managed", desc: "You manage your own funding and pay providers directly" },
  { value: "plan-managed", label: "Plan-managed", desc: "A plan manager handles payments to providers on your behalf" },
  { value: "agency-managed", label: "Agency-managed (NDIA-managed)", desc: "The NDIA manages your funding — you must use registered providers" },
];

interface Category { id: string; name: string; slug: string; }

interface FormData {
  categorySlug: string;
  categoryName: string;
  description: string;
  postcode: string;
  suburb: string;
  state: string;
  ageGroup: string;
  accessMethod: string;
  ndisNumber: string;
  additionalNotes: string;
}

function ServiceRequestInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status: authStatus } = useSession();

  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    categorySlug: searchParams.get("category") || "",
    categoryName: "",
    description: "",
    postcode: "",
    suburb: "",
    state: "",
    ageGroup: "",
    accessMethod: "",
    ndisNumber: "",
    additionalNotes: "",
  });

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      const params = new URLSearchParams(searchParams.toString());
      router.push(`/login?redirect=/service-request?${params.toString()}`);
    }
  }, [authStatus, router, searchParams]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        if (form.categorySlug) {
          const cat = (d.categories || []).find(
            (c: Category) => c.slug === form.categorySlug
          );
          if (cat) setForm((f) => ({ ...f, categoryName: cat.name }));
        }
      });
  }, [form.categorySlug]);

  function update(key: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validateStep(): boolean {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!form.categorySlug) errs.categorySlug = "Select a category";
      if (form.description.length < 20) errs.description = "At least 20 characters required";
    } else if (step === 1) {
      if (!/^\d{4}$/.test(form.postcode)) errs.postcode = "Enter a valid 4-digit postcode";
    } else if (step === 2) {
      if (!form.ageGroup) errs.ageGroup = "Select an age group";
      if (!form.accessMethod) errs.accessMethod = "Select an access method";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function next() {
    if (validateStep()) setStep((s) => Math.min(s + 1, 3));
  }
  function back() { setStep((s) => Math.max(s - 1, 0)); }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setMatchCount(data.matchCount || 0);
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrors({ submit: data.error || "Something went wrong" });
      }
    } catch {
      setErrors({ submit: "Something went wrong" });
    }
    setSubmitting(false);
  }

  if (authStatus === "loading") {
    return <div className="py-16 text-center text-gray-500">Loading...</div>;
  }

  if (
    session?.user?.role === "PROVIDER_ADMIN" ||
    session?.user?.role === "PROVIDER_STAFF"
  ) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-gray-600">
          Service requests are for participants. Use the directory search
          instead.
        </p>
        <Link href="/search" className="mt-4 inline-block text-blue-600 hover:underline">
          Go to Search
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-6 text-2xl font-bold text-gray-900">
          Your request has been submitted!
        </h1>
        <p className="mx-auto mt-3 max-w-md text-gray-600">
          We&apos;re matching you with providers who deliver{" "}
          {form.categoryName} in {form.suburb || form.postcode}.
        </p>
        <div className="mx-auto mt-8 max-w-md rounded-lg border bg-gray-50 p-5">
          <p className="font-semibold text-gray-700">What&apos;s next?</p>
          <ol className="mt-3 space-y-1 text-left text-sm text-gray-600">
            <li>1. We notify matching providers (within minutes)</li>
            <li>2. Providers review your request</li>
            <li>3. Accepted providers contact you directly</li>
            <li>4. You choose the provider that&apos;s right for you</li>
          </ol>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/search"
            className="inline-flex items-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Browse more services
          </Link>
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i < step
                    ? "bg-blue-600 text-white"
                    : i === step
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`mt-1 hidden text-xs sm:block ${
                  i === step ? "font-medium text-blue-600" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-12 sm:w-16 ${
                  i < step ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {errors.submit && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {/* Step 1: Service */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Step 1 of 4</p>
            <h2 className="text-xl font-bold text-gray-900">
              What service are you looking for?
            </h2>
          </div>
          <div>
            <Label>Service Type *</Label>
            <Select
              value={form.categorySlug}
              onValueChange={(v) => {
                if (!v) return;
                const cat = categories.find((c) => c.slug === v);
                update("categorySlug", v);
                if (cat) update("categoryName", cat.name);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a service category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categorySlug && (
              <p className="mt-1 text-sm text-red-600">{errors.categorySlug}</p>
            )}
          </div>
          <div>
            <Label>Tell us what you&apos;re looking for *</Label>
            <Textarea
              rows={4}
              maxLength={1000}
              placeholder="Describe what kind of support you need, any preferences, and what's important to you..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-1"
            />
            <div className="mt-1 flex justify-between text-xs text-gray-400">
              <span>Min. 20 characters</span>
              <span>{form.description.length} / 1000</span>
            </div>
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={next} className="bg-blue-600 text-white hover:bg-blue-700">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Step 2 of 4</p>
            <h2 className="text-xl font-bold text-gray-900">
              Where do you need this service?
            </h2>
          </div>
          <div>
            <Label>Postcode *</Label>
            <div className="mt-1">
              <LocationPicker
                postcode={form.postcode}
                onPostcodeChange={(v) => update("postcode", v)}
                onLocationResolved={(d) => {
                  update("suburb", d.suburb);
                  update("state", d.state);
                }}
              />
            </div>
            {errors.postcode && (
              <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>
            )}
          </div>
          <div>
            <Label>Suburb</Label>
            <Input
              value={form.suburb}
              onChange={(e) => update("suburb", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>State</Label>
            <Select
              value={form.state}
              onValueChange={(v) => v && update("state", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {["NSW", "VIC", "QLD", "SA", "WA", "TAS", "ACT", "NT"].map(
                  (s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={back}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button onClick={next} className="bg-blue-600 text-white hover:bg-blue-700">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: About You */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Step 3 of 4</p>
            <h2 className="text-xl font-bold text-gray-900">
              A few details about you
            </h2>
            <p className="text-sm text-gray-500">This helps us find the best match</p>
          </div>
          <div>
            <Label>Age Group *</Label>
            <div className="mt-2 space-y-2">
              {AGE_GROUPS.map((g) => (
                <label
                  key={g.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    form.ageGroup === g.value
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="ageGroup"
                    value={g.value}
                    checked={form.ageGroup === g.value}
                    onChange={() => update("ageGroup", g.value)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm">{g.label}</span>
                </label>
              ))}
            </div>
            {errors.ageGroup && (
              <p className="mt-1 text-sm text-red-600">{errors.ageGroup}</p>
            )}
          </div>
          <div>
            <Label>How is your NDIS plan managed? *</Label>
            <div className="mt-2 space-y-2">
              {ACCESS_METHODS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                    form.accessMethod === m.value
                      ? "border-blue-600 bg-blue-50"
                      : "hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="accessMethod"
                    value={m.value}
                    checked={form.accessMethod === m.value}
                    onChange={() => update("accessMethod", m.value)}
                    className="mt-0.5 accent-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium">{m.label}</span>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            {form.accessMethod === "agency-managed" && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Agency-managed participants can only use NDIS-registered providers.
                We will only match you with registered providers.
              </div>
            )}
            {errors.accessMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.accessMethod}</p>
            )}
          </div>
          <div>
            <Label>NDIS Number (optional)</Label>
            <Input
              placeholder="e.g. 43XXXXXXXX"
              value={form.ndisNumber}
              onChange={(e) => update("ndisNumber", e.target.value)}
              className="mt-1"
            />
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
              <Lock size={12} /> Your NDIS number is kept private and never shared
            </p>
          </div>
          <div>
            <Label>Anything else we should know? (optional)</Label>
            <Textarea
              rows={3}
              maxLength={500}
              placeholder="Any special requirements, preferences, or information..."
              value={form.additionalNotes}
              onChange={(e) => update("additionalNotes", e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="ghost" onClick={back}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button onClick={next} className="bg-blue-600 text-white hover:bg-blue-700">
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">Step 4 of 4</p>
            <h2 className="text-xl font-bold text-gray-900">
              Review your service request
            </h2>
          </div>

          <div className="divide-y rounded-xl border bg-white">
            {[
              { label: "Service", value: form.categoryName, step: 0 },
              { label: "Location", value: `${form.postcode}${form.suburb ? ` — ${form.suburb}` : ""}${form.state ? `, ${form.state}` : ""}`, step: 1 },
              { label: "Age Group", value: AGE_GROUPS.find((g) => g.value === form.ageGroup)?.label || form.ageGroup, step: 2 },
              { label: "Plan Management", value: ACCESS_METHODS.find((m) => m.value === form.accessMethod)?.label || form.accessMethod, step: 2 },
              { label: "Description", value: form.description, step: 0 },
              ...(form.additionalNotes ? [{ label: "Additional Notes", value: form.additionalNotes, step: 2 }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-start justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{row.label}</p>
                  <p className="mt-0.5 text-sm text-gray-900">{row.value}</p>
                </div>
                <button
                  onClick={() => setStep(row.step)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <Info size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                What happens next?
              </span>
            </div>
            <p className="mt-2 text-sm text-blue-700">
              We&apos;ll match your request with up to 3 providers who deliver
              this service in your area. Your personal details are only shared
              with providers who accept your request.
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={back}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 px-8 text-white hover:bg-blue-700"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Submit Request</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ServiceRequestPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading...</div>}>
      <ServiceRequestInner />
    </Suspense>
  );
}
