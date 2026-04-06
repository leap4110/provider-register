import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await db.providerMember.findUnique({
    where: { userId: session.user.id },
    select: { providerId: true },
  });
  if (!member) {
    return NextResponse.json({ error: "No provider" }, { status: 403 });
  }

  const match = await db.serviceRequestMatch.findUnique({ where: { id } });
  if (!match || match.providerId !== member.providerId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { action } = body;

  const statusMap: Record<string, { status: string; field?: string }> = {
    accept: { status: "ACCEPTED", field: "acceptedAt" },
    decline: { status: "DECLINED", field: "declinedAt" },
    reserve: { status: "MATCHED", field: "reservedAt" },
    in_progress: { status: "IN_PROGRESS" },
    successful: { status: "SUCCESSFUL" },
    unsuccessful: { status: "UNSUCCESSFUL" },
  };

  const update = statusMap[action];
  if (!update) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const data: Record<string, unknown> = { status: update.status };
  if (update.field) data[update.field] = new Date();

  const updated = await db.serviceRequestMatch.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}
