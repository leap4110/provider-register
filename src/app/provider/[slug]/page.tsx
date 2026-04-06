import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  ShieldX,
  Shield,
  AlertTriangle,
  BadgeCheck,
  Globe,
  Phone,
  Mail,
} from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarRating } from "@/components/reviews/StarRating";
import { AboutTab } from "@/components/provider/AboutTab";
import { ServicesTab } from "@/components/provider/ServicesTab";
import { ReviewsTab } from "@/components/provider/ReviewsTab";
import { ComplianceTab } from "@/components/provider/ComplianceTab";
import { ProviderSidebar } from "@/components/provider/ProviderSidebar";

async function getProviderBySlug(slug: string) {
  return db.provider.findUnique({
    where: { slug },
    include: {
      serviceOfferings: {
        where: { isActive: true },
        include: { category: true },
        orderBy: { createdAt: "asc" },
      },
      reviews: {
        where: { isPublished: true },
        include: { user: { select: { name: true, id: true } } },
        orderBy: { createdAt: "desc" },
      },
      complianceActions: {
        orderBy: [{ isActive: "desc" }, { dateIssued: "desc" }],
      },
      banningOrders: { orderBy: { dateIssued: "desc" } },
      photoGallery: { orderBy: { order: "asc" } },
      categories: { include: { category: true } },
      _count: { select: { reviews: { where: { isPublished: true } } } },
    },
  });
}

function calculateAverageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return null;
  return (
    Math.round(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10
    ) / 10
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) return { title: "Provider Not Found" };

  const avgRating = calculateAverageRating(provider.reviews);
  const description = provider.description
    ? provider.description.substring(0, 160)
    : `Find reviews and information about ${provider.name} on our NDIS provider directory.`;

  return {
    title: `${provider.name} — NDIS Provider Directory`,
    description,
    openGraph: {
      title: provider.name,
      description,
      images: provider.logo ? [{ url: provider.logo }] : [],
    },
  };
}

export default async function ProviderProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const session = await auth();
  const avgRating = calculateAverageRating(provider.reviews);
  const reviewCount = provider._count.reviews;
  const showGallery =
    provider.tier === "ACCREDITATION_PLUS" || provider.tier === "ENTERPRISE";
  const showContact =
    provider.tier === "ACCREDITATION_PLUS" || provider.tier === "ENTERPRISE";

  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: provider.reviews.filter((r) => r.rating === stars).length,
  }));

  const firstCategorySlug = provider.serviceOfferings[0]?.category?.slug;

  // Serialize reviews for client component
  const serializedReviews = provider.reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/search">Search</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{provider.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Provider Header */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start gap-5">
          {/* Logo */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            {provider.logo ? (
              <Image
                src={provider.logo}
                alt={provider.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400">
                {getInitials(provider.name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {provider.name}
            </h1>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-2">
              {avgRating ? (
                <>
                  <StarRating rating={avgRating} size="md" />
                  <span className="text-base font-semibold text-gray-900">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                  </span>
                </>
              ) : (
                <span className="text-sm italic text-gray-400">
                  No reviews yet
                </span>
              )}
            </div>

            {/* Location */}
            <div className="mt-2 flex items-center gap-1.5">
              <MapPin size={16} className="text-gray-400" />
              {provider.suburb ? (
                <span className="text-sm text-gray-600">
                  {provider.suburb}
                  {provider.state ? `, ${provider.state}` : ""}
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  Location not provided
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {provider.registrationStatus === "REGISTERED" && (
                <Badge className="gap-1 border-teal-200 bg-teal-50 text-teal-700">
                  <ShieldCheck size={14} /> NDIS Registered
                </Badge>
              )}
              {provider.registrationStatus === "CONDITIONS_APPLIED" && (
                <Badge className="gap-1 border-amber-200 bg-amber-50 text-amber-700">
                  <AlertTriangle size={14} /> Registered — Conditions Applied
                </Badge>
              )}
              {provider.registrationStatus === "UNREGISTERED" && (
                <Badge variant="outline" className="gap-1 text-gray-500">
                  <Shield size={14} /> Not Registered
                </Badge>
              )}
              {provider.registrationStatus === "DEREGISTERED" && (
                <Badge className="gap-1 border-red-200 bg-red-50 text-red-700">
                  <ShieldX size={14} /> De-registered
                </Badge>
              )}
              {provider.accredited && (
                <Badge className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
                  <BadgeCheck size={14} /> Accredited
                </Badge>
              )}
            </div>

            {/* Contact buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {provider.website && (
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Globe className="mr-1.5 h-4 w-4" /> Website
                  </Button>
                </a>
              )}
              {showContact && provider.phone && (
                <a href={`tel:${provider.phone}`}>
                  <Button variant="outline" size="sm">
                    <Phone className="mr-1.5 h-4 w-4" /> {provider.phone}
                  </Button>
                </a>
              )}
              {showContact && provider.email && (
                <a href={`mailto:${provider.email}`}>
                  <Button variant="outline" size="sm">
                    <Mail className="mr-1.5 h-4 w-4" /> Email
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Sidebar — shown first on mobile */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <ProviderSidebar
              provider={{
                slug: provider.slug,
                abn: provider.abn,
                ndisProviderNumber: provider.ndisProviderNumber,
                ndisRegistered: provider.ndisRegistered,
                lastAuditDate: provider.lastAuditDate?.toISOString() || null,
                registrationGroups: provider.registrationGroups,
                suburb: provider.suburb,
                state: provider.state,
                postcode: provider.postcode,
                latitude: provider.latitude,
                longitude: provider.longitude,
                hideExactAddress: provider.hideExactAddress,
                phone: provider.phone,
                tier: provider.tier,
                createdAt: provider.createdAt.toISOString(),
              }}
              firstCategorySlug={firstCategorySlug}
            />
          </div>

          {/* Tabs — main content */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">
                  Reviews ({reviewCount})
                </TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-6">
                <AboutTab
                  description={provider.description}
                  photos={provider.photoGallery.map((p) => ({
                    id: p.id,
                    url: p.url,
                    alt: p.alt,
                  }))}
                  providerName={provider.name}
                  showGallery={showGallery}
                />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <ServicesTab
                  offerings={provider.serviceOfferings.map((o) => ({
                    id: o.id,
                    category: { name: o.category.name },
                    description: o.description,
                    sa4Codes: o.sa4Codes,
                    ageGroups: o.ageGroups,
                    accessMethods: o.accessMethods,
                    languages: o.languages,
                    availableDays: o.availableDays,
                    telehealth: o.telehealth,
                    mobileService: o.mobileService,
                  }))}
                />
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <ReviewsTab
                  providerId={provider.id}
                  providerName={provider.name}
                  providerSlug={provider.slug}
                  reviews={serializedReviews}
                  averageRating={avgRating}
                  reviewCount={reviewCount}
                  distribution={distribution}
                  currentUserId={session?.user?.id}
                />
              </TabsContent>

              <TabsContent value="compliance" className="mt-6">
                <ComplianceTab
                  registrationStatus={provider.registrationStatus}
                  ndisRegistered={provider.ndisRegistered}
                  ndisProviderNumber={provider.ndisProviderNumber}
                  lastAuditDate={
                    provider.lastAuditDate?.toISOString() || null
                  }
                  conditionsOnReg={provider.conditionsOnReg}
                  registrationGroups={provider.registrationGroups}
                  complianceActions={provider.complianceActions.map((a) => ({
                    ...a,
                    dateIssued: a.dateIssued.toISOString(),
                    dateResolved: a.dateResolved?.toISOString() || null,
                  }))}
                  createdAt={provider.createdAt.toISOString()}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
