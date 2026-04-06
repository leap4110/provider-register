"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, MapPin, Phone, Mail } from "lucide-react";
import { StarRating } from "@/components/reviews/StarRating";
import { timeAgo } from "@/lib/utils/format";

interface ServiceRequest {
  id: string;
  description: string;
  postcode: string;
  suburb: string | null;
  state: string | null;
  additionalNotes: string | null;
  status: string;
  createdAt: string;
  matches: {
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
  }[];
}

export default function ReferralsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/my-requests")
      .then((r) => r.json())
      .then((d) => {
        setRequests(d.requests || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-bold text-gray-900">My Referrals</h1>
      <p className="text-sm text-gray-500">
        Track service requests you&apos;ve submitted for participants
      </p>

      <div className="mt-6">
        {requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-medium text-gray-700">
              No referrals yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Submit a request on behalf of a participant to get started
            </p>
            <Link
              href="/connect/request"
              className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              Submit Request
            </Link>
          </div>
        ) : (
          requests.map((req) => {
            const accepted = req.matches.filter((m) =>
              ["ACCEPTED", "IN_PROGRESS", "SUCCESSFUL"].includes(m.status)
            );
            const pending = req.matches.filter((m) => m.status === "OPEN");

            return (
              <div key={req.id} className="mb-4 rounded-xl border bg-white p-5">
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

                <div className="mt-3 space-y-1 text-sm">
                  {accepted.length > 0 && (
                    <p className="text-green-700">
                      {accepted.length} accepted
                    </p>
                  )}
                  {pending.length > 0 && (
                    <p className="text-gray-600">{pending.length} pending</p>
                  )}
                </div>

                {accepted.map((m) => (
                  <div
                    key={m.id}
                    className="mt-3 rounded-lg border bg-green-50 p-3"
                  >
                    <Link
                      href={`/provider/${m.provider.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-700"
                    >
                      {m.provider.name}
                    </Link>
                    {m.provider.averageRating && (
                      <div className="mt-1">
                        <StarRating
                          rating={m.provider.averageRating}
                          size="sm"
                        />
                      </div>
                    )}
                    <div className="mt-2 flex gap-4 text-sm">
                      {m.provider.phone && (
                        <a
                          href={`tel:${m.provider.phone}`}
                          className="flex items-center gap-1 text-blue-600"
                        >
                          <Phone size={14} /> {m.provider.phone}
                        </a>
                      )}
                      {m.provider.email && (
                        <a
                          href={`mailto:${m.provider.email}`}
                          className="flex items-center gap-1 text-blue-600"
                        >
                          <Mail size={14} /> Email
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
