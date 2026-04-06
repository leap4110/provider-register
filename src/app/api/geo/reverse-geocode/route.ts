import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") || "");
  const lng = parseFloat(searchParams.get("lng") || "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "Invalid latitude or longitude" },
      { status: 400 }
    );
  }

  // Validate Australian bounds
  if (lat < -44 || lat > -10 || lng < 112 || lng > 154) {
    return NextResponse.json(
      { error: "Coordinates are outside Australia" },
      { status: 400 }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === "your-server-side-google-maps-key") {
    return NextResponse.json(
      {
        error:
          "Location lookup is not configured. Please enter your postcode manually.",
      },
      { status: 503 }
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&result_type=postal_code`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK" || !data.results?.length) {
      return NextResponse.json(
        { error: "Could not resolve location to an address" },
        { status: 502 }
      );
    }

    const result = data.results[0];
    const components = result.address_components || [];

    let postcode = "";
    let suburb = "";
    let state = "";

    for (const component of components) {
      if (component.types.includes("postal_code")) {
        postcode = component.long_name;
      }
      if (component.types.includes("locality")) {
        suburb = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
    }

    if (!postcode) {
      return NextResponse.json(
        { error: "Could not determine postcode from location" },
        { status: 502 }
      );
    }

    return NextResponse.json({ postcode, suburb, state });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to geocoding service" },
      { status: 502 }
    );
  }
}
