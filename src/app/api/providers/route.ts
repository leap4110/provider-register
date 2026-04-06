import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const q = searchParams.get("q") || undefined;
  const category = searchParams.get("category") || undefined;
  const postcode = searchParams.get("postcode") || undefined;
  const registered = searchParams.get("registered") || undefined;
  const accessMethod = searchParams.get("accessMethod") || undefined;
  const ageGroup = searchParams.get("ageGroup") || undefined;
  const language = searchParams.get("language") || undefined;
  const delivery = searchParams.get("delivery") || undefined;
  const sort = searchParams.get("sort") || "relevant";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));

  // Build where clause
  const where: Prisma.ProviderWhereInput = {};
  const andConditions: Prisma.ProviderWhereInput[] = [];

  // Text search
  if (q) {
    andConditions.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    });
  }

  // Registration filter
  if (registered === "true") {
    andConditions.push({ ndisRegistered: true });
  } else if (registered === "false") {
    andConditions.push({ ndisRegistered: false });
  }

  // Category filter
  if (category) {
    andConditions.push({
      categories: {
        some: {
          category: { slug: category },
        },
      },
    });
  }

  // Service offering filters
  const offeringFilters: Prisma.ServiceOfferingWhereInput = { isActive: true };
  let hasOfferingFilter = false;

  // Postcode -> SA4 lookup
  if (postcode && /^\d{4}$/.test(postcode)) {
    const mapping = await db.postcodeMapping.findUnique({
      where: { postcode },
    });
    if (mapping) {
      offeringFilters.sa4Codes = { has: mapping.sa4Code };
      hasOfferingFilter = true;
    }
  }

  if (accessMethod) {
    offeringFilters.accessMethods = { has: accessMethod };
    hasOfferingFilter = true;
  }

  if (ageGroup) {
    offeringFilters.ageGroups = { has: ageGroup };
    hasOfferingFilter = true;
  }

  if (language) {
    offeringFilters.languages = { has: language };
    hasOfferingFilter = true;
  }

  if (delivery === "telehealth") {
    offeringFilters.telehealth = true;
    hasOfferingFilter = true;
  } else if (delivery === "mobile") {
    offeringFilters.mobileService = true;
    hasOfferingFilter = true;
  }

  if (hasOfferingFilter) {
    andConditions.push({
      serviceOfferings: { some: offeringFilters },
    });
  }

  if (andConditions.length > 0) {
    where.AND = andConditions;
  }

  // Build orderBy
  let orderBy: Prisma.ProviderOrderByWithRelationInput[] = [];
  switch (sort) {
    case "newest":
      orderBy = [{ createdAt: "desc" }];
      break;
    case "name-az":
      orderBy = [{ name: "asc" }];
      break;
    case "relevant":
    default:
      orderBy = [{ accredited: "desc" }, { profileViews: "desc" }];
      break;
  }

  // Get total count
  const total = await db.provider.count({ where });

  // Fetch providers
  const providers = await db.provider.findMany({
    where,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      categories: {
        include: { category: true },
      },
      reviews: {
        where: { isPublished: true },
        select: { rating: true },
      },
      complianceActions: {
        where: { isActive: true },
        select: { id: true },
      },
    },
  });

  // Transform results
  const results = providers.map((provider) => {
    const ratings = provider.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : null;

    return {
      id: provider.id,
      name: provider.name,
      slug: provider.slug,
      logo: provider.logo,
      suburb: provider.suburb,
      state: provider.state,
      latitude: provider.latitude,
      longitude: provider.longitude,
      description: provider.description,
      ndisRegistered: provider.ndisRegistered,
      registrationStatus: provider.registrationStatus,
      accredited: provider.accredited,
      averageRating,
      reviewCount: provider.reviews.length,
      hasComplianceIssues: provider.complianceActions.length > 0,
      complianceActionCount: provider.complianceActions.length,
      categories: provider.categories.map((pc) => ({
        name: pc.category.name,
        slug: pc.category.slug,
      })),
    };
  });

  // Sort by rating/reviews in JS since they're computed fields
  if (sort === "highest-rated") {
    results.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
  } else if (sort === "most-reviews") {
    results.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return NextResponse.json({
    providers: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
