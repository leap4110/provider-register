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

  const matches = await db.serviceRequestMatch.findMany({
    where: { providerId: member.providerId },
    include: {
      serviceRequest: {
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      },
    },
    orderBy: { serviceRequest: { createdAt: "desc" } },
  });

  return NextResponse.json({ matches });
}
