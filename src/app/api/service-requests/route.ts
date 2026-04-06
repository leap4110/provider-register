import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { matchServiceRequest } from "@/lib/matching/service-request-matcher";
import { sendRequestConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const role = session.user.role;
  if (role !== "PARTICIPANT" && role !== "SUPPORT_COORDINATOR") {
    return NextResponse.json(
      { error: "Only participants can submit service requests" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const {
    categorySlug,
    description,
    postcode,
    suburb,
    state,
    ageGroup,
    accessMethod,
    ndisNumber,
    additionalNotes,
    maxProviders = 3,
  } = body;

  if (!categorySlug || !description || !postcode || !ageGroup || !accessMethod) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (description.length < 20 || description.length > 1000) {
    return NextResponse.json(
      { error: "Description must be between 20 and 1000 characters" },
      { status: 400 }
    );
  }

  // Resolve category
  const category = await db.serviceCategory.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 400 });
  }

  // Resolve SA4
  let sa4Code: string | null = null;
  const mapping = await db.postcodeMapping.findUnique({
    where: { postcode },
  });
  if (mapping) sa4Code = mapping.sa4Code;

  // Create request
  const serviceRequest = await db.serviceRequest.create({
    data: {
      userId: session.user.id,
      categoryId: category.id,
      description,
      postcode,
      suburb: suburb || mapping?.suburb || null,
      state: state || mapping?.state || null,
      sa4Code,
      ageGroup,
      accessMethod,
      ndisNumber: ndisNumber || null,
      additionalNotes: additionalNotes || null,
      maxProviders,
      status: "OPEN",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // Run matching
  const matchResult = await matchServiceRequest(serviceRequest.id);

  // Send confirmation to participant
  try {
    await sendRequestConfirmationEmail({
      to: session.user.email!,
      participantName: session.user.name!,
      categoryName: category.name,
      postcode,
      suburb: suburb || mapping?.suburb || "",
      matchCount: matchResult.totalMatches,
    });
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }

  return NextResponse.json(
    { request: serviceRequest, matchCount: matchResult.totalMatches },
    { status: 201 }
  );
}
