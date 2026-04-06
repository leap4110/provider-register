import Link from "next/link";
import Image from "next/image";
import { MapPin, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/reviews/StarRating";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
    suburb: string | null;
    state: string | null;
    description: string | null;
    ndisRegistered: boolean;
    averageRating: number | null;
    reviewCount: number;
    hasComplianceIssues: boolean;
    complianceActionCount: number;
    categories: { name: string; slug: string }[];
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <Link href={`/provider/${provider.slug}`} className="block">
      <div className="mb-4 rounded-xl border bg-white p-4 transition-shadow duration-200 hover:shadow-md md:p-5">
        <div className="flex items-start">
          {/* Logo */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-100">
            {provider.logo ? (
              <Image
                src={provider.logo}
                alt={provider.name}
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {getInitials(provider.name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-800 hover:underline">
              {provider.name}
            </h3>

            {/* Rating */}
            <div className="mt-1 flex items-center gap-2">
              {provider.averageRating ? (
                <>
                  <StarRating rating={provider.averageRating} size="sm" />
                  <span className="text-sm font-medium text-gray-900">
                    {provider.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({provider.reviewCount} review
                    {provider.reviewCount !== 1 ? "s" : ""})
                  </span>
                </>
              ) : (
                <span className="text-sm italic text-gray-400">
                  No reviews yet
                </span>
              )}
            </div>

            {/* Location + Registration */}
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              {(provider.suburb || provider.state) && (
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {[provider.suburb, provider.state].filter(Boolean).join(", ")}
                </span>
              )}
              {provider.ndisRegistered ? (
                <Badge className="border-teal-200 bg-teal-50 text-teal-700">
                  ✓ Registered
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  Unregistered
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {provider.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {provider.description}
          </p>
        )}

        {/* Category badges */}
        {provider.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {provider.categories.slice(0, 5).map((cat) => (
              <Badge
                key={cat.slug}
                className="border-blue-200 bg-blue-50 text-xs font-normal text-blue-700"
              >
                {cat.name}
              </Badge>
            ))}
            {provider.categories.length > 5 && (
              <span className="text-xs text-gray-500">
                +{provider.categories.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Compliance warning */}
        {provider.hasComplianceIssues && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-sm text-red-700">
              {provider.complianceActionCount} active compliance action
              {provider.complianceActionCount !== 1 ? "s" : ""} — View details
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
