import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function getProviderForUser(userId: string) {
  const member = await db.providerMember.findUnique({
    where: { userId },
    select: { providerId: true, provider: { select: { tier: true } } },
  });
  return member;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await getProviderForUser(session.user.id);
  if (!member) {
    return NextResponse.json({ error: "No provider" }, { status: 403 });
  }

  const offerings = await db.serviceOffering.findMany({
    where: { providerId: member.providerId },
    include: { category: { select: { name: true, icon: true } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ offerings });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await getProviderForUser(session.user.id);
  if (!member) {
    return NextResponse.json({ error: "No provider" }, { status: 403 });
  }

  const tierLimits: Record<string, number> = {
    STARTER: 3,
    ACCREDITATION_PLUS: 10,
    ENTERPRISE: 999,
  };
  const limit = tierLimits[member.provider.tier] || 3;
  const count = await db.serviceOffering.count({
    where: { providerId: member.providerId },
  });

  if (count >= limit) {
    return NextResponse.json(
      { error: "Offering limit reached for your plan" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const offering = await db.serviceOffering.create({
    data: {
      providerId: member.providerId,
      categoryId: body.categoryId,
      description: body.description || null,
      ageGroups: body.ageGroups || [],
      accessMethods: body.accessMethods || [],
      languages: body.languages || [],
      availableDays: body.availableDays || [],
      sa4Codes: body.sa4Codes || [],
      postcodes: body.postcodes || [],
      telehealth: body.telehealth || false,
      mobileService: body.mobileService || false,
    },
  });

  return NextResponse.json(offering, { status: 201 });
}
