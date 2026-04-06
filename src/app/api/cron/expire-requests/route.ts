import { NextResponse } from "next/server";
import { expireOldRequests } from "@/lib/matching/expire-requests";

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.CRON_SECRET;

  if (expected && secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const expired = await expireOldRequests();
  return NextResponse.json({ expired });
}
