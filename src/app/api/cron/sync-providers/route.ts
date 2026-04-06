import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Provider sync cron triggered at", new Date().toISOString());

  return NextResponse.json({
    message: "Provider sync triggered",
    timestamp: new Date().toISOString(),
  });
}
