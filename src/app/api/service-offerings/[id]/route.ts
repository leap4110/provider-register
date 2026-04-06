import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyOwnership(userId: string, offeringId: string) {
  const member = await db.providerMember.findUnique({
    where: { userId },
    select: { providerId: true },
  });
  if (!member) return null;

  const offering = await db.serviceOffering.findUnique({
    where: { id: offeringId },
    include: { category: true },
  });
  if (!offering || offering.providerId !== member.providerId) return null;
  return offering;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const offering = await verifyOwnership(session.user.id, id);
  if (!offering) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(offering);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await verifyOwnership(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await db.serviceOffering.update({
    where: { id },
    data: {
      description: body.description ?? existing.description,
      ageGroups: body.ageGroups ?? existing.ageGroups,
      accessMethods: body.accessMethods ?? existing.accessMethods,
      languages: body.languages ?? existing.languages,
      availableDays: body.availableDays ?? existing.availableDays,
      sa4Codes: body.sa4Codes ?? existing.sa4Codes,
      postcodes: body.postcodes ?? existing.postcodes,
      telehealth: body.telehealth ?? existing.telehealth,
      mobileService: body.mobileService ?? existing.mobileService,
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await verifyOwnership(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const updated = await db.serviceOffering.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await verifyOwnership(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.serviceOffering.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
