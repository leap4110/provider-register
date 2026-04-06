import { NextResponse } from "next/server";

// Brisbane fallback for development (localhost has no real IP)
const BRISBANE_FALLBACK = {
  latitude: -27.468,
  longitude: 153.024,
  city: "Brisbane",
  state: "QLD",
  postcode: "4000",
  country: "AU",
  source: "fallback" as const,
};

export async function GET(req: Request) {
  // Extract client IP from headers (set by reverse proxy / Vercel / Cloudflare)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || null;

  // In development, localhost IPs won't resolve — use Brisbane fallback
  if (
    !ip ||
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return NextResponse.json(BRISBANE_FALLBACK, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  }

  try {
    // ip-api.com — free tier, 45 req/min, no key needed
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionCode,zip,lat,lon,country`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    const data = await response.json();

    if (data.status !== "success") {
      return NextResponse.json(BRISBANE_FALLBACK, {
        headers: { "Cache-Control": "public, s-maxage=3600" },
      });
    }

    return NextResponse.json(
      {
        latitude: data.lat,
        longitude: data.lon,
        city: data.city || null,
        state: data.regionCode || null,
        postcode: data.zip || null,
        country: data.country || "AU",
        source: "ip",
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600" },
      }
    );
  } catch {
    return NextResponse.json(BRISBANE_FALLBACK, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  }
}
