import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await db.notificationSettings.findUnique({
    where: { userId: session.user.id },
  });

  return NextResponse.json(
    settings || {
      emailEnabled: true,
      smsEnabled: true,
      serviceRequests: true,
      reviewAlerts: true,
      marketingEmails: false,
    }
  );
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const settings = await db.notificationSettings.upsert({
    where: { userId: session.user.id },
    update: {
      emailEnabled: body.emailEnabled,
      smsEnabled: body.smsEnabled,
      serviceRequests: body.serviceRequests,
      reviewAlerts: body.reviewAlerts,
      marketingEmails: body.marketingEmails,
    },
    create: {
      userId: session.user.id,
      emailEnabled: body.emailEnabled ?? true,
      smsEnabled: body.smsEnabled ?? true,
      serviceRequests: body.serviceRequests ?? true,
      reviewAlerts: body.reviewAlerts ?? true,
      marketingEmails: body.marketingEmails ?? false,
    },
  });

  return NextResponse.json(settings);
}
