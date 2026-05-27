import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { TargetType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    targetType: string;
    targetId: string;
    rating: number;
    content: string;
  };
  const { targetType, targetId, rating, content } = body;

  if (!targetType || !targetId || !rating || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const type = targetType as TargetType;
  const userId = session.user.id;

  const review = await prisma.review.create({
    data: {
      userId,
      targetType: type,
      ...(type === "ATTRACTION" ? { attractionId: targetId } : { foodId: targetId }),
      rating,
      content: content.trim().slice(0, 2000),
    },
    include: { user: { select: { name: true, image: true } } },
  });

  // Update average rating
  if (type === "ATTRACTION") {
    const agg = await prisma.review.aggregate({
      where: { attractionId: targetId, published: true },
      _avg: { rating: true },
    });
    await prisma.attraction.update({
      where: { id: targetId },
      data: { rating: agg._avg.rating ?? 0 },
    });
  }

  return NextResponse.json(review, { status: 201 });
}
