import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const cities = await prisma.city.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(cities);
}

export async function POST(request: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await request.json() as {
    slug: string; nameEn: string; nameZh: string; nameJa?: string; nameKo?: string; nameFr?: string;
    descEn: string; descZh: string; heroImage: string; lat: number; lng: number; published: boolean;
  };

  const city = await prisma.city.create({
    data: {
      slug: body.slug,
      nameEn: body.nameEn,
      nameZh: body.nameZh,
      nameJa: body.nameJa,
      nameKo: body.nameKo,
      nameFr: body.nameFr,
      descEn: body.descEn,
      descZh: body.descZh,
      heroImage: body.heroImage,
      lat: body.lat,
      lng: body.lng,
      published: body.published,
    },
  });

  return NextResponse.json(city, { status: 201 });
}
