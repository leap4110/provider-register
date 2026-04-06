"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, MapPin, Phone, Mail } from "lucide-react";
import { StarRating } from "@/components/reviews/StarRating";
import { timeAgo } from "@/lib/utils/format";

interface ProviderMatch {
  id: string;
  status: string;
  provider: {
    name: string;
    slug: string;
    averageRating: number | null;
    reviewCount: number;
    phone?: string;
    email?: string;
  };
}

interface ServiceRequest {
  id: string;
  description: string;
  postcode: string;
  suburb: string | null;
  state: string | null;
  ageGroup: string | null;
  accessMethod: string | null;
  status: string;
  createdAt: string;
  expiresAt: string;
  matches: ProviderMatch[];
}

const STATUS_DOT: Record<string, string> = {
  OPEN: "bg-green-500",
  ACCEPTED: "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  SUCCESSFUL: "bg-green-500",
  DECLINED: "bg-red-500",
  EXPIRED: "bg-gray-300",
};

export default function MyRequestsPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login?redirect=/my-requests");
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === "authenticated") {
      fetch("/api/my-requests")
        .then((r) => r.json())
        .then((d) => {
          setRequests(d.requests || []);
          setLoading(false);
        });
    }
  }, [authStatus]);

  if (authStatus === "loading" || loading) {
    return <div className="py-16 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">My Service Requests</h1>
      <p className="text-sm text-gray-500">
        Track the status of your service requests
      </p>

      <div className="mt-6">
        {requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-medium text-gray-700">
              No service requests yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Submit a request and we&apos;ll connect you with matching providers
            </p>
            <Link
              href="/service-request"
              className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Submit a Request
            </Link>
          </div>
        ) : (
          requests.map((req) => {
            const accepted = req.matches.filter(
              (m) =>
                m.status === "ACCEPTED" ||
                m.status === "IN_PROGRESS" ||
                m.status === "SUCCESSFUL"
            );
            const pending = req.matches.filter((m) => m.status === "OPEN");
            const declined = req.matches.filter((m) => m.status === "DECLINED");
            const isExpired =
              req.status === "EXPIRED" ||
              (new Date(req.expiresAt) < new Date() && accepted.length === 0);

            return (
              <div
                key={req.id}
                className="mb-4 rounded-xl border bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900">
                    Service Request
                  </h3>
                  <span className="text-sm text-gray-400">
                    {timeAgo(req.createdAt)}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                  <MapPin size={14} />
                  {req.postcode}
                  {req.suburb && ` — ${req.suburb}`}
                  {req.state && `, ${req.state}`}
                </div>

                <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                  {req.description}
                </p>

                {/* Match Status */}
                <div className="mt-4 space-y-1">
                  {accepted.length > 0 && (
                    <p className="flex items-center gap-2 text-sm text-green-700">
                      <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                      {accepted.length} provider{accepted.length > 1 ? "s" : ""}{" "}
                      accepted
                    </p>
                  )}
                  {pending.length > 0 && (
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                      {pending.length} pending
                    </p>
                  )}
                  {declined.length > 0 && (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
                      {declined.length} declined
                    </p>
                  )}
                </div>

                {/* Accepted Providers */}
                {accepted.map((match) => (
                  <div
                    key={match.id}
                    className="mt-3 rounded-lg border bg-green-50 p-4"
                  >
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/provider/${match.provider.slug}`}
                        className="font-medium text-gray-900 hover:text-blue-700"
                      >
                        {match.provider.name}
                      </Link>
                      {match.provider.averageRating && (
                        <StarRating
                          rating={match.provider.averageRating}
                          size="sm"
                        />
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      {match.provider.phone && (
                        <a
                          href={`tel:${match.provider.phone}`}
                          className="flex items-center gap-1 text-blue-600"
                        >
                          <Phone size={14} /> {match.provider.phone}
                        </a>
                      )}
                      {match.provider.email && (
                        <a
                          href={`mailto:${match.provider.email}`}
                          className="flex items-center gap-1 text-blue-600"
                        >
                          <Mail size={14} /> {match.provider.email}
                        </a>
                      )}
                    </div>
                    <Link
                      href={`/provider/${match.provider.slug}`}
                      className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                    >
                      View Profile →
                    </Link>
                  </div>
                ))}

                {isExpired && accepted.length === 0 && (
                  <p className="mt-3 text-sm text-amber-600">
                    This request has expired.{" "}
                    <Link
                      href="/service-request"
                      className="text-blue-600 hover:underline"
                    >
                      Submit a new request
                    </Link>
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/service-request"
          className="text-sm text-blue-600 hover:underline"
        >
          Submit a new request →
        </Link>
      </div>
    </div>
  );
}
