import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanTestData() {
  console.log("Cleaning test data...\n");

  // Find test users by email domain
  const testUsers = await prisma.user.findMany({
    where: { email: { contains: ".test.com" } },
    select: { id: true, email: true },
  });

  if (testUsers.length === 0) {
    console.log("No test data found.");
    return;
  }

  const testUserIds = testUsers.map((u) => u.id);

  // Find providers linked to test users
  const testMembers = await prisma.providerMember.findMany({
    where: { userId: { in: testUserIds } },
    select: { providerId: true },
  });
  const testProviderIds = testMembers.map((m) => m.providerId);

  // Delete in reverse dependency order
  if (testProviderIds.length > 0) {
    await prisma.serviceRequestMatch.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.complianceAction.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.banningOrder.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.providerPhoto.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.serviceOffering.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.providerCategory.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.review.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.providerMember.deleteMany({
      where: { providerId: { in: testProviderIds } },
    });
    await prisma.provider.deleteMany({
      where: { id: { in: testProviderIds } },
    });
    console.log(`  Deleted ${testProviderIds.length} providers and related data`);
  }

  // Delete service requests by test users
  await prisma.serviceRequest.deleteMany({
    where: { userId: { in: testUserIds } },
  });

  // Delete reviews by test users
  await prisma.review.deleteMany({
    where: { userId: { in: testUserIds } },
  });

  // Delete notification settings
  await prisma.notificationSettings.deleteMany({
    where: { userId: { in: testUserIds } },
  });

  // Delete sessions
  await prisma.session.deleteMany({
    where: { userId: { in: testUserIds } },
  });

  // Delete users
  await prisma.user.deleteMany({
    where: { id: { in: testUserIds } },
  });
  console.log(`  Deleted ${testUsers.length} test users`);

  // Delete test blog posts
  await prisma.blogPost.deleteMany({
    where: { authorName: { in: ["Angela Martinez", "Rachel Thompson", "Platform Team"] } },
  });

  // Delete test postcodes and SA4 regions
  await prisma.postcodeMapping.deleteMany({});
  await prisma.sA4Region.deleteMany({});
  console.log("  Deleted postcodes and SA4 regions");

  console.log("\n✅ Test data cleaned successfully");
}

cleanTestData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
