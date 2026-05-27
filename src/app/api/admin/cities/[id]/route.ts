import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

interface Ctx { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const body = await request.json() as {
    slug?: string; nameEn?: string; nameZh?: string; nameJa?: string; nameKo?: string; nameFr?: string;
    descEn?: string; descZh?: string; heroImage?: string; lat?: number; lng?: number; published?: boolean;
  };

  const city = await prisma.city.update({
    where: { id },
    data: {
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.nameEn !== undefined && { nameEn: body.nameEn }),
      ...(body.nameZh !== undefined && { nameZh: body.nameZh }),
      ...(body.nameJa !== undefined && { nameJa: body.nameJa }),
      ...(body.nameKo !== undefined && { nameKo: body.nameKo }),
      ...(body.nameFr !== undefined && { nameFr: body.nameFr }),
      ...(body.descEn !== undefined && { descEn: body.descEn }),
      ...(body.descZh !== undefined && { descZh: body.descZh }),
      ...(body.heroImage !== undefined && { heroImage: body.heroImage }),
      ...(body.lat !== undefined && { lat: body.lat }),
      ...(body.lng !== undefined && { lng: body.lng }),
      ...(body.published !== undefined && { published: body.published }),
    },
  });

  return NextResponse.json(city);
}

export async function DELETE(_request: NextRequest, { params }: Ctx) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  await prisma.city.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
