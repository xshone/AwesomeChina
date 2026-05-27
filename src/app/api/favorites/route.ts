import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { TargetType } from "@prisma/client";

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json() as { targetType: string; targetId: string };
    const { targetType, targetId } = body;

    if (!targetType || !targetId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const type = targetType as TargetType;
    const userId = session.user.id;

    const existing = await prisma.favorite.findFirst({
        where: {
            userId,
            targetType: type,
            ...(type === "ATTRACTION" ? { attractionId: targetId } : { foodId: targetId }),
        },
    });

    if (existing) {
        await prisma.favorite.delete({ where: { id: existing.id } });
        return NextResponse.json({ favorited: false });
    }

    await prisma.favorite.create({
        data: {
            userId,
            targetType: type,
            ...(type === "ATTRACTION" ? { attractionId: targetId } : { foodId: targetId }),
        },
    });

    return NextResponse.json({ favorited: true });
}
