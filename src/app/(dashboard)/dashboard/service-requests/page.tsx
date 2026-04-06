"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Inbox, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { timeAgo } from "@/lib/utils/format";
import { toast } from "sonner";

interface ServiceRequestMatch {
  id: string;
  status: string;
  reservedAt: string | null;
  acceptedAt: string | null;
  serviceRequest: {
    id: string;
    description: string;
    postcode: string;
    suburb: string | null;
    state: string | null;
    ageGroup: string | null;
    accessMethod: string | null;
    categoryId: string | null;
    createdAt: string;
  };
  categoryName?: string;
}

const STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-500",
  ACCEPTED: "bg-blue-500",
  IN_PROGRESS: "bg-amber-500",
  SUCCESSFUL: "bg-green-500",
  UNSUCCESSFUL: "bg-gray-400",
  DECLINED: "bg-red-500",
  EXPIRED: "bg-gray-300",
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  ACCEPTED: "Accepted",
  IN_PROGRESS: "In Progress",
  SUCCESSFUL: "Successful",
  UNSUCCESSFUL: "Unsuccessful",
  DECLINED: "Declined",
  EXPIRED: "Expired",
};

export default function ServiceRequestsPage() {
  const [matches, setMatches] = useState<ServiceRequestMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("OPEN");

  useEffect(() => {
    fetch("/api/dashboard/service-requests")
      .then((r) => r.json())
      .then((data) => {
        setMatches(data.matches || []);
        setLoading(false);
      });
  }, []);

  const filtered =
    tab === "ALL" ? matches : matches.filter((m) => m.status === tab);

  const counts: Record<string, number> = {};
  for (const m of matches) {
    counts[m.status] = (counts[m.status] || 0) + 1;
  }

  async function updateStatus(matchId: string, action: string) {
    const res = await fetch(`/api/dashboard/service-requests/${matchId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status: updated.status } : m))
      );
      toast.success(`Request ${action}ed`);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Service Requests</h1>
      <p className="text-sm text-gray-500">
        Manage incoming service requests from participants
      </p>

      <Tabs value={tab} onValueChange={(v) => v && setTab(v)} className="mt-6">
        <TabsList>
          <TabsTrigger value="ALL">All ({matches.length})</TabsTrigger>
          <TabsTrigger value="OPEN">Open ({counts.OPEN || 0})</TabsTrigger>
          <TabsTrigger value="ACCEPTED">Accepted ({counts.ACCEPTED || 0})</TabsTrigger>
          <TabsTrigger value="IN_PROGRESS">In Progress ({counts.IN_PROGRESS || 0})</TabsTrigger>
          <TabsTrigger value="SUCCESSFUL">Successful ({counts.SUCCESSFUL || 0})</TabsTrigger>
          <TabsTrigger value="DECLINED">Declined ({counts.DECLINED || 0})</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center">
            <Inbox className="mx-auto h-10 w-10 text-gray-300" />
            <h3 className="mt-3 font-medium text-gray-700">
              No service requests
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Requests from participants will appear here when your service
              offerings are matched.
            </p>
          </div>
        ) : (
          filtered.map((match) => (
            <div key={match.id} className="mb-4 rounded-xl border bg-white p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${STATUS_COLORS[match.status] || "bg-gray-300"}`}
                  />
                  <span className="font-medium text-gray-900">
                    {STATUS_LABELS[match.status] || match.status}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {timeAgo(match.serviceRequest.createdAt)}
                </span>
              </div>

              <p className="mt-2 text-lg font-semibold text-gray-900">
                {match.categoryName || "Service Request"}
              </p>

              <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={14} />
                {match.serviceRequest.postcode}
                {match.serviceRequest.suburb &&
                  ` — ${match.serviceRequest.suburb}`}
                {match.serviceRequest.state &&
                  `, ${match.serviceRequest.state}`}
              </div>

              <p className="mt-3 text-sm text-gray-700 line-clamp-2">
                {match.serviceRequest.description}
              </p>

              <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                {match.serviceRequest.ageGroup && (
                  <span>Age: {match.serviceRequest.ageGroup}</span>
                )}
                {match.serviceRequest.accessMethod && (
                  <span>{match.serviceRequest.accessMethod}</span>
                )}
              </div>

              <div className="mt-4 flex justify-end gap-2">
                {match.status === "OPEN" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => updateStatus(match.id, "decline")}
                    >
                      Decline
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => updateStatus(match.id, "accept")}
                    >
                      Accept
                    </Button>
                  </>
                )}
                {match.status === "ACCEPTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(match.id, "in_progress")}
                  >
                    Mark In Progress
                  </Button>
                )}
                {match.status === "IN_PROGRESS" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(match.id, "unsuccessful")}
                    >
                      Unsuccessful
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => updateStatus(match.id, "successful")}
                    >
                      Mark Successful
                    </Button>
                  </>
                )}
                <Link
                  href={`/dashboard/service-requests/${match.id}`}
                  className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  View
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
