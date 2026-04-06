import Link from "next/link";
import { Send, MapPin, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatABN, formatDate } from "@/lib/utils/format";

interface ProviderSidebarProps {
  provider: {
    slug: string;
    abn: string | null;
    ndisProviderNumber: string | null;
    ndisRegistered: boolean;
    lastAuditDate: string | Date | null;
    registrationGroups: string[];
    suburb: string | null;
    state: string | null;
    postcode: string | null;
    latitude: number | null;
    longitude: number | null;
    hideExactAddress: boolean;
    phone: string | null;
    tier: string;
    createdAt: string | Date;
  };
  firstCategorySlug?: string;
}

export function ProviderSidebar({
  provider,
  firstCategorySlug,
}: ProviderSidebarProps) {
  const showContactDetails =
    provider.tier === "ACCREDITATION_PLUS" || provider.tier === "ENTERPRISE";

  return (
    <div className="sticky top-24 space-y-6">
      {/* Service Request CTA */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Need this service?
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Submit a service request and we&apos;ll connect you with up to 3
          matching providers.
        </p>
        <Link
          href={`/service-request?provider=${provider.slug}${firstCategorySlug ? `&category=${firstCategorySlug}` : ""}`}
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Send className="h-4 w-4" />
          Request Service
        </Link>
        {showContactDetails && provider.phone && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Or call:{" "}
            <a
              href={`tel:${provider.phone}`}
              className="text-blue-600 hover:underline"
            >
              {provider.phone}
            </a>
          </p>
        )}
      </div>

      {/* Map Placeholder */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="px-4 pb-2 pt-4 text-sm font-semibold text-gray-700">
          Location
        </div>
        <div className="flex h-56 items-center justify-center bg-gray-100">
          {provider.latitude && provider.longitude ? (
            <p className="text-sm text-gray-500">
              Map requires Google Maps API key
            </p>
          ) : (
            <p className="text-sm text-gray-400">Location not available</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 px-4 py-3 text-sm text-gray-600">
          <MapPin size={14} />
          {provider.suburb || provider.state || provider.postcode ? (
            <>
              {[provider.suburb, provider.state, provider.postcode]
                .filter(Boolean)
                .join(", ")}
              {provider.hideExactAddress && (
                <span className="text-gray-400"> (approximate location)</span>
              )}
            </>
          ) : (
            <span className="text-gray-400">Location not provided</span>
          )}
        </div>
      </div>

      {/* Provider Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">
          Provider Details
        </h3>
        <div className="space-y-2.5">
          {provider.abn && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-500">ABN</span>
              <span className="text-right text-sm font-medium text-gray-900">
                {formatABN(provider.abn)}
              </span>
            </div>
          )}
          {provider.ndisProviderNumber && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-500">NDIS Number</span>
              <span className="text-right text-sm font-medium text-gray-900">
                {provider.ndisProviderNumber}
              </span>
            </div>
          )}
          <div className="flex items-start justify-between">
            <span className="text-sm text-gray-500">Registered</span>
            <span className="text-right text-sm font-medium text-gray-900">
              {provider.ndisRegistered ? "Yes" : "No"}
            </span>
          </div>
          {provider.lastAuditDate && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-gray-500">Last Audit</span>
              <span className="text-right text-sm font-medium text-gray-900">
                {formatDate(provider.lastAuditDate)}
              </span>
            </div>
          )}
        </div>

        {provider.registrationGroups.length > 0 && (
          <div className="mt-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Registration Groups
            </h4>
            <div className="space-y-1">
              {provider.registrationGroups.map((group, i) => (
                <p key={i} className="pl-3 text-sm text-gray-600">
                  · {group}
                </p>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500">
          <Flag size={12} />
          Report this listing
        </button>
      </div>
    </div>
  );
}
