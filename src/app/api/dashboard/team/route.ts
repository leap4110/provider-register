import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
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

  const members = await db.providerMember.findMany({
    where: { providerId: member.providerId },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
    },
  });

  return NextResponse.json({ members });
}
