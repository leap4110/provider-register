import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const withCount = searchParams.get("withCount") === "true";

  const categories = await db.serviceCategory.findMany({
    orderBy: { name: "asc" },
    ...(withCount && {
      include: {
        _count: {
          select: {
            providers: true,
          },
        },
      },
    }),
  });

  const result = categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    ...(withCount && {
      providerCount: (cat as unknown as { _count: { providers: number } })
        ._count.providers,
    }),
  }));

  return NextResponse.json({ categories: result });
}
