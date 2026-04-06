import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye, Inbox, Star, MessageSquare, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StarRating } from "@/components/reviews/StarRating";
import { timeAgo } from "@/lib/utils/format";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  OPEN: { label: "Open", color: "bg-green-500", bg: "bg-green-50" },
  MATCHED: { label: "Matched", color: "bg-purple-500", bg: "bg-purple-50" },
  ACCEPTED: { label: "Accepted", color: "bg-blue-500", bg: "bg-blue-50" },
  IN_PROGRESS: {
    label: "In Progress",
    color: "bg-amber-500",
    bg: "bg-amber-50",
  },
  SUCCESSFUL: {
    label: "Successful",
    color: "bg-emerald-500",
    bg: "bg-emerald-50",
  },
  UNSUCCESSFUL: {
    label: "Unsuccessful",
    color: "bg-red-500",
    bg: "bg-red-50",
  },
  DECLINED: { label: "Declined", color: "bg-gray-500", bg: "bg-gray-50" },
  EXPIRED: { label: "Expired", color: "bg-gray-400", bg: "bg-gray-50" },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/dashboard");
  }

  const member = await db.providerMember.findUnique({
    where: { userId: session.user.id },
    include: {
      provider: true,
    },
  });

  if (!member) {
    redirect("/");
  }

  const provider = member.provider;
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  // Fetch stats, recent requests, and recent reviews in parallel
  const [openRequests, reviews, recentMatches, recentReviews] =
    await Promise.all([
      db.serviceRequestMatch.count({
        where: {
          providerId: provider.id,
          status: "OPEN",
        },
      }),
      db.review.aggregate({
        where: {
          providerId: provider.id,
          isPublished: true,
        },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      db.serviceRequestMatch.findMany({
        where: { providerId: provider.id },
        include: {
          serviceRequest: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
        orderBy: { serviceRequest: { createdAt: "desc" } },
        take: 5,
      }),
      db.review.findMany({
        where: {
          providerId: provider.id,
          isPublished: true,
        },
        include: {
          user: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
    ]);

  const avgRating = reviews._avg.rating ?? 0;
  const totalReviews = reviews._count.rating;

  const stats = [
    {
      title: "Profile Views",
      value: provider.profileViews.toLocaleString(),
      icon: Eye,
    },
    {
      title: "Open Requests",
      value: openRequests.toString(),
      icon: Inbox,
    },
    {
      title: "Average Rating",
      value: avgRating > 0 ? avgRating.toFixed(1) : "--",
      icon: Star,
    },
    {
      title: "Total Reviews",
      value: totalReviews.toString(),
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your provider profile.
          </p>
        </div>
        <Link
          href={`/provider/${provider.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View public profile
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="relative rounded-xl border bg-white p-5"
          >
            <stat.icon className="absolute right-5 top-5 h-5 w-5 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Service Requests */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Service Requests
          </h2>
          <Link
            href="/dashboard/service-requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {recentMatches.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentMatches.map((match) => {
                const request = match.serviceRequest;
                const config = statusConfig[match.status] ?? statusConfig.OPEN;
                return (
                  <TableRow key={match.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${config.color}`}
                        />
                        <span className="text-sm text-gray-700">
                          {config.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-gray-900">
                      {request.description.length > 60
                        ? `${request.description.slice(0, 60)}...`
                        : request.description}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {request.suburb
                        ? `${request.suburb}, ${request.state}`
                        : request.postcode}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {timeAgo(request.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/dashboard/service-requests/${match.serviceRequestId}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="px-5 py-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              No service requests yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              When participants request your services, they&apos;ll appear here.
            </p>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      <div className="rounded-xl border bg-white">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reviews
          </h2>
          <Link
            href="/dashboard/reviews"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {recentReviews.length > 0 ? (
          <div className="divide-y">
            {recentReviews.map((review) => (
              <div key={review.id} className="px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      {review.title && (
                        <span className="text-sm font-medium text-gray-900">
                          {review.title}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {review.content}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <span>{review.user.name}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{timeAgo(review.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-5 py-12 text-center">
            <MessageSquare className="mx-auto h-8 w-8 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              No reviews yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Reviews from participants will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
