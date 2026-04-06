"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { formatDate, timeAgo } from "@/lib/utils/format";
import { toast } from "sonner";

interface RequestDetail {
  id: string;
  status: string;
  reservedAt: string | null;
  acceptedAt: string | null;
  declinedAt: string | null;
  internalNotes: string | null;
  serviceRequest: {
    description: string;
    postcode: string;
    suburb: string | null;
    state: string | null;
    ageGroup: string | null;
    accessMethod: string | null;
    additionalNotes: string | null;
    createdAt: string;
    user: { name: string; email: string; phone: string | null };
  };
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-100 text-green-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  SUCCESSFUL: "bg-green-100 text-green-800",
  UNSUCCESSFUL: "bg-gray-100 text-gray-800",
  DECLINED: "bg-red-100 text-red-800",
};

export default function ServiceRequestDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<RequestDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard/service-requests/${id}`)
      .then((r) => r.json())
      .then((d) => {
        // Handle both direct match and nested structure
        const match = d.match || d;
        setData(match);
        setNotes(match.internalNotes || "");
        setLoading(false);
      });
  }, [id]);

  async function saveNotes() {
    await fetch(`/api/dashboard/service-requests/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "notes", notes }),
    });
    toast.success("Notes saved");
  }

  if (loading || !data) {
    return <div className="py-8 text-center text-gray-500">Loading...</div>;
  }

  const showContact = ["ACCEPTED", "IN_PROGRESS", "SUCCESSFUL"].includes(data.status);

  return (
    <div>
      <Link
        href="/dashboard/service-requests"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft size={16} /> Back to requests
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">Service Request</h1>
        <Badge className={STATUS_COLORS[data.status] || "bg-gray-100"}>
          {data.status.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Request Details */}
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-gray-900">Request Details</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} />
              {data.serviceRequest.postcode}
              {data.serviceRequest.suburb && ` — ${data.serviceRequest.suburb}`}
              {data.serviceRequest.state && `, ${data.serviceRequest.state}`}
            </div>
            {data.serviceRequest.ageGroup && (
              <p className="text-sm text-gray-600">
                Age: {data.serviceRequest.ageGroup}
              </p>
            )}
            {data.serviceRequest.accessMethod && (
              <p className="text-sm text-gray-600">
                Access: {data.serviceRequest.accessMethod}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Submitted {timeAgo(data.serviceRequest.createdAt)}
            </p>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">Description</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {data.serviceRequest.description}
            </p>
          </div>
          {data.serviceRequest.additionalNotes && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">
                Additional Notes
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                {data.serviceRequest.additionalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Contact + Notes */}
        <div className="space-y-6">
          {showContact && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="font-semibold text-blue-900">
                Participant Contact
              </h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <User size={14} />
                  {data.serviceRequest.user.name}
                </div>
                {data.serviceRequest.user.phone && (
                  <a
                    href={`tel:${data.serviceRequest.user.phone}`}
                    className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
                  >
                    <Phone size={14} />
                    {data.serviceRequest.user.phone}
                  </a>
                )}
                <a
                  href={`mailto:${data.serviceRequest.user.email}`}
                  className="flex items-center gap-2 text-sm text-blue-700 hover:underline"
                >
                  <Mail size={14} />
                  {data.serviceRequest.user.email}
                </a>
              </div>
            </div>
          )}

          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-gray-900">Internal Notes</h2>
            <p className="mt-1 text-xs text-gray-400">
              Private — not visible to the participant
            </p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add your notes..."
              className="mt-3"
            />
            <Button
              onClick={saveNotes}
              className="mt-3 bg-blue-600 text-white hover:bg-blue-700"
              size="sm"
            >
              Save Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
