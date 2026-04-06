"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Users, Building, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const registerSchema = z.object({
  role: z.enum(["PARTICIPANT", "PROVIDER_ADMIN", "SUPPORT_COORDINATOR"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.literal(true, {
    error: "You must agree to the Terms of Service",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: "PARTICIPANT" as const,
    label: "Participant, Carer or Family",
    icon: Users,
  },
  {
    value: "PROVIDER_ADMIN" as const,
    label: "Service Provider",
    icon: Building,
  },
  {
    value: "SUPPORT_COORDINATOR" as const,
    label: "Support Coordinator",
    icon: Compass,
  },
];

const redirectMap: Record<string, string> = {
  PARTICIPANT: "/",
  PROVIDER_ADMIN: "/dashboard",
  SUPPORT_COORDINATOR: "/connect",
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: "PARTICIPANT",
    },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: RegisterFormData) {
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone || undefined,
          role: data.role,
        }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong");
        return;
      }

      // Auto sign-in
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        router.push("/login");
        return;
      }

      router.push(redirectMap[data.role] || "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto mt-12 w-full max-w-md px-4 pb-12">
      <div className="rounded-xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Create an account
          </h1>
          <p className="mt-1 text-gray-500">Join the NDIS community</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role selector */}
          <div className="space-y-2">
            <Label>I am a...</Label>
            <div className="grid gap-2">
              {roleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("role", option.value)}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${isSelected ? "text-blue-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-700"}`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Jane Smith"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className="mt-1"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="04XX XXX XXX"
              {...register("phone")}
              className="mt-1"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                {...register("password")}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              onCheckedChange={(checked) =>
                setValue("terms", checked === true ? true : (false as never))
              }
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && (
            <p className="text-sm text-red-600">{errors.terms.message}</p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
