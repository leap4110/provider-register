import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await db.serviceRequest.findMany({
    where: { userId: session.user.id },
    include: {
      matches: {
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              slug: true,
              phone: true,
              email: true,
              tier: true,
              reviews: {
                where: { isPublished: true },
                select: { rating: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Transform: only reveal provider contact for accepted matches
  const result = requests.map((req) => ({
    ...req,
    matches: req.matches.map((m) => ({
      id: m.id,
      status: m.status,
      provider: {
        name: m.provider.name,
        slug: m.provider.slug,
        averageRating:
          m.provider.reviews.length > 0
            ? Math.round(
                (m.provider.reviews.reduce((s, r) => s + r.rating, 0) /
                  m.provider.reviews.length) *
                  10
              ) / 10
            : null,
        reviewCount: m.provider.reviews.length,
        // Only show contact if accepted
        ...(["ACCEPTED", "IN_PROGRESS", "SUCCESSFUL"].includes(m.status) &&
        (m.provider.tier === "ACCREDITATION_PLUS" ||
          m.provider.tier === "ENTERPRISE")
          ? { phone: m.provider.phone, email: m.provider.email }
          : {}),
      },
    })),
  }));

  return NextResponse.json({ requests: result });
}
