import { db } from "@/lib/db";
import { sendServiceRequestEmail } from "@/lib/email";
import { sendServiceRequestSMS } from "@/lib/sms";

interface MatchResult {
  totalMatches: number;
  matchedProviderIds: string[];
}

export async function matchServiceRequest(
  serviceRequestId: string
): Promise<MatchResult> {
  const request = await db.serviceRequest.findUnique({
    where: { id: serviceRequestId },
    include: { user: true },
  });

  if (!request) throw new Error("Service request not found");

  // Resolve postcode to SA4
  let sa4Code = request.sa4Code;
  if (!sa4Code && request.postcode) {
    const mapping = await db.postcodeMapping.findUnique({
      where: { postcode: request.postcode },
    });
    if (mapping) {
      sa4Code = mapping.sa4Code;
      await db.serviceRequest.update({
        where: { id: serviceRequestId },
        data: {
          sa4Code,
          suburb: request.suburb || mapping.suburb,
          state: request.state || mapping.state,
        },
      });
    }
  }

  if (!sa4Code) {
    console.warn(`Could not resolve SA4 for postcode ${request.postcode}`);
    return { totalMatches: 0, matchedProviderIds: [] };
  }

  // Find matching service offerings
  const matchingOfferings = await db.serviceOffering.findMany({
    where: {
      isActive: true,
      ...(request.categoryId ? { categoryId: request.categoryId } : {}),
      sa4Codes: { has: sa4Code },
      ...(request.accessMethod
        ? { accessMethods: { has: request.accessMethod } }
        : {}),
      ...(request.ageGroup
        ? { ageGroups: { has: request.ageGroup } }
        : {}),
    },
    include: {
      provider: {
        include: {
          reviews: {
            where: { isPublished: true },
            select: { rating: true },
          },
        },
      },
    },
  });

  // Deduplicate by provider
  const providerMap = new Map<
    string,
    (typeof matchingOfferings)[0]["provider"]
  >();
  for (const offering of matchingOfferings) {
    if (!providerMap.has(offering.providerId)) {
      providerMap.set(offering.providerId, offering.provider);
    }
  }

  // Filter: agency-managed → only registered providers
  let eligible = Array.from(providerMap.entries());
  if (request.accessMethod === "agency-managed") {
    eligible = eligible.filter(([, p]) => p.ndisRegistered);
  }

  // Sort: accredited first, then by rating
  eligible.sort((a, b) => {
    const pA = a[1];
    const pB = b[1];
    if (pA.accredited && !pB.accredited) return -1;
    if (!pA.accredited && pB.accredited) return 1;
    const avgA =
      pA.reviews.length > 0
        ? pA.reviews.reduce((s, r) => s + r.rating, 0) / pA.reviews.length
        : 0;
    const avgB =
      pB.reviews.length > 0
        ? pB.reviews.reduce((s, r) => s + r.rating, 0) / pB.reviews.length
        : 0;
    return avgB - avgA;
  });

  const topProviders = eligible.slice(0, request.maxProviders);

  if (topProviders.length === 0) {
    return { totalMatches: 0, matchedProviderIds: [] };
  }

  // Create match records
  const matchedProviderIds: string[] = [];
  for (const [providerId] of topProviders) {
    await db.serviceRequestMatch.create({
      data: { serviceRequestId, providerId, status: "OPEN" },
    });
    matchedProviderIds.push(providerId);
  }

  // Update request status
  await db.serviceRequest.update({
    where: { id: serviceRequestId },
    data: { status: "MATCHED" },
  });

  // Notify providers
  const categoryName = request.categoryId
    ? (
        await db.serviceCategory.findUnique({
          where: { id: request.categoryId },
        })
      )?.name || "General"
    : "General";

  for (const [providerId] of topProviders) {
    const members = await db.providerMember.findMany({
      where: { providerId },
      include: { user: { include: { notifications: true } } },
    });

    for (const member of members) {
      const settings = member.user.notifications;
      const shouldEmail =
        settings?.emailEnabled !== false &&
        settings?.serviceRequests !== false;
      const shouldSMS =
        settings?.smsEnabled !== false &&
        settings?.serviceRequests !== false;

      if (shouldEmail && member.user.email) {
        try {
          await sendServiceRequestEmail({
            to: member.user.email,
            providerName: member.user.name,
            categoryName,
            postcode: request.postcode,
            suburb: request.suburb || "",
            requestId: request.id,
          });
        } catch (error) {
          console.error(`Email failed for ${member.user.email}:`, error);
        }
      }

      if (shouldSMS && member.user.phone) {
        try {
          await sendServiceRequestSMS({
            to: member.user.phone,
            categoryName,
            postcode: request.postcode,
            suburb: request.suburb || "",
            requestId: request.id,
          });
        } catch (error) {
          console.error(`SMS failed for ${member.user.phone}:`, error);
        }
      }
    }
  }

  return { totalMatches: topProviders.length, matchedProviderIds };
}
