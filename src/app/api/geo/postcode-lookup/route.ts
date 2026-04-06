import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postcode = searchParams.get("postcode");

  if (!postcode || !/^\d{4}$/.test(postcode)) {
    return NextResponse.json(
      { error: "Invalid postcode. Must be 4 digits." },
      { status: 400 }
    );
  }

  const mapping = await db.postcodeMapping.findUnique({
    where: { postcode },
  });

  if (!mapping) {
    return NextResponse.json(
      { error: "Postcode not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    postcode: mapping.postcode,
    suburb: mapping.suburb,
    state: mapping.state,
    sa4Code: mapping.sa4Code,
    latitude: mapping.latitude,
    longitude: mapping.longitude,
  });
}
