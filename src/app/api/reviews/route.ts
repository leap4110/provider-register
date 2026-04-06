import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();
  const { providerId, rating, title, content } = body;

  if (!providerId || !rating || !content) {
    return NextResponse.json(
      { error: "Provider ID, rating, and content are required" },
      { status: 400 }
    );
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be between 1 and 5" },
      { status: 400 }
    );
  }

  if (content.length < 10 || content.length > 2000) {
    return NextResponse.json(
      { error: "Review must be between 10 and 2000 characters" },
      { status: 400 }
    );
  }

  // Check provider exists
  const provider = await db.provider.findUnique({
    where: { id: providerId },
    select: { id: true },
  });

  if (!provider) {
    return NextResponse.json({ error: "Provider not found" }, { status: 404 });
  }

  // Check for duplicate
  const existing = await db.review.findUnique({
    where: {
      providerId_userId: {
        providerId,
        userId: session.user.id,
      },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already reviewed this provider" },
      { status: 409 }
    );
  }

  const review = await db.review.create({
    data: {
      providerId,
      userId: session.user.id,
      rating,
      title: title || null,
      content,
      isPublished: true,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
