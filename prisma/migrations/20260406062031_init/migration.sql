-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PARTICIPANT', 'PROVIDER_ADMIN', 'PROVIDER_STAFF', 'SUPPORT_COORDINATOR', 'PLATFORM_ADMIN');

-- CreateEnum
CREATE TYPE "ProviderTier" AS ENUM ('STARTER', 'ACCREDITATION_PLUS', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('REGISTERED', 'UNREGISTERED', 'DEREGISTERED', 'CONDITIONS_APPLIED');

-- CreateEnum
CREATE TYPE "ComplianceActionType" AS ENUM ('CONDITION_ON_REGISTRATION', 'SUSPENSION', 'REVOCATION', 'BANNING_ORDER', 'INFRINGEMENT_NOTICE', 'COMPLIANCE_NOTICE', 'ENFORCEABLE_UNDERTAKING', 'COURT_ORDER');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('OPEN', 'MATCHED', 'ACCEPTED', 'IN_PROGRESS', 'SUCCESSFUL', 'UNSUCCESSFUL', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "abn" TEXT,
    "description" TEXT,
    "logo" TEXT,
    "website" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "suburb" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "hideExactAddress" BOOLEAN NOT NULL DEFAULT false,
    "ndisRegistered" BOOLEAN NOT NULL DEFAULT false,
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'UNREGISTERED',
    "ndisProviderNumber" TEXT,
    "registrationGroups" TEXT[],
    "lastAuditDate" TIMESTAMP(3),
    "conditionsOnReg" TEXT,
    "tier" "ProviderTier" NOT NULL DEFAULT 'STARTER',
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionId" TEXT,
    "subscriptionStatus" TEXT,
    "accredited" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "searchImpressions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',

    CONSTRAINT "ProviderMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPhoto" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProviderPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceAction" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "ComplianceActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "dateResolved" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sourceUrl" TEXT,

    CONSTRAINT "ComplianceAction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BanningOrder" (
    "id" TEXT NOT NULL,
    "providerId" TEXT,
    "individualName" TEXT,
    "description" TEXT NOT NULL,
    "dateIssued" TIMESTAMP(3) NOT NULL,
    "dateExpires" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sourceUrl" TEXT,

    CONSTRAINT "BanningOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "parentId" TEXT,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderCategory" (
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProviderCategory_pkey" PRIMARY KEY ("providerId","categoryId")
);

-- CreateTable
CREATE TABLE "ServiceOffering" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sa4Codes" TEXT[],
    "postcodes" TEXT[],
    "ageGroups" TEXT[],
    "accessMethods" TEXT[],
    "languages" TEXT[],
    "availableDays" TEXT[],
    "telehealth" BOOLEAN NOT NULL DEFAULT false,
    "mobileService" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceOffering_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "description" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "sa4Code" TEXT,
    "suburb" TEXT,
    "state" TEXT,
    "ageGroup" TEXT,
    "accessMethod" TEXT,
    "ndisNumber" TEXT,
    "additionalNotes" TEXT,
    "maxProviders" INTEGER NOT NULL DEFAULT 3,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequestMatch" (
    "id" TEXT NOT NULL,
    "serviceRequestId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "reservedAt" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "internalNotes" TEXT,

    CONSTRAINT "ServiceRequestMatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SA4Region" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcodes" TEXT[],

    CONSTRAINT "SA4Region_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "PostcodeMapping" (
    "postcode" TEXT NOT NULL,
    "suburb" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "sa4Code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PostcodeMapping_pkey" PRIMARY KEY ("postcode")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "coverImage" TEXT,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "serviceRequests" BOOLEAN NOT NULL DEFAULT true,
    "reviewAlerts" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_abn_key" ON "Provider"("abn");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderMember_userId_key" ON "ProviderMember"("userId");

-- CreateIndex
CREATE INDEX "ComplianceAction_providerId_isActive_idx" ON "ComplianceAction"("providerId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_name_key" ON "ServiceCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceOffering_categoryId_isActive_idx" ON "ServiceOffering"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Review_providerId_isPublished_idx" ON "Review"("providerId", "isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Review_providerId_userId_key" ON "Review"("providerId", "userId");

-- CreateIndex
CREATE INDEX "ServiceRequestMatch_providerId_status_idx" ON "ServiceRequestMatch"("providerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequestMatch_serviceRequestId_providerId_key" ON "ServiceRequestMatch"("serviceRequestId", "providerId");

-- CreateIndex
CREATE INDEX "PostcodeMapping_sa4Code_idx" ON "PostcodeMapping"("sa4Code");

-- CreateIndex
CREATE INDEX "PostcodeMapping_state_idx" ON "PostcodeMapping"("state");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderMember" ADD CONSTRAINT "ProviderMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderMember" ADD CONSTRAINT "ProviderMember_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPhoto" ADD CONSTRAINT "ProviderPhoto_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceAction" ADD CONSTRAINT "ComplianceAction_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanningOrder" ADD CONSTRAINT "BanningOrder_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceCategory" ADD CONSTRAINT "ServiceCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ServiceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderCategory" ADD CONSTRAINT "ProviderCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOffering" ADD CONSTRAINT "ServiceOffering_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOffering" ADD CONSTRAINT "ServiceOffering_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestMatch" ADD CONSTRAINT "ServiceRequestMatch_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequestMatch" ADD CONSTRAINT "ServiceRequestMatch_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
