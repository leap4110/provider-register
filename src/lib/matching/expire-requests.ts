import { db } from "@/lib/db";

export async function expireOldRequests(): Promise<number> {
  const result = await db.serviceRequest.updateMany({
    where: {
      expiresAt: { lt: new Date() },
      status: { in: ["OPEN", "MATCHED"] },
    },
    data: { status: "EXPIRED" },
  });

  if (result.count > 0) {
    await db.serviceRequestMatch.updateMany({
      where: {
        serviceRequest: { status: "EXPIRED" },
        status: "OPEN",
      },
      data: { status: "EXPIRED" },
    });
  }

  console.log(`Expired ${result.count} service requests`);
  return result.count;
}
