import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import CityDetailClient from "./CityDetailClient";

export async function generateStaticParams() {
    const cities = await prisma.city.findMany({ select: { slug: true } });
    return cities.map((c: { slug: string }) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const city = await prisma.city.findUnique({ where: { slug } });
    if (!city) return {};
    return {
        title: `${city.nameEn} — Cities`,
        description: city.descEn.slice(0, 160),
        openGraph: { images: [city.heroImage] },
    };
}

export default async function CityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();

    const city = await prisma.city.findUnique({
        where: { slug, published: true },
        include: {
            attractions: { where: { published: true }, orderBy: { rating: "desc" } },
            foods: { where: { published: true } },
        },
    });

    if (!city) notFound();

    let userFavoriteAttractionIds: string[] = [];
    let userFavoriteFoodIds: string[] = [];

    if (session?.user?.id) {
        const favs = await prisma.favorite.findMany({
            where: { userId: session.user.id },
            select: { targetType: true, attractionId: true, foodId: true },
        });
        userFavoriteAttractionIds = favs
            .filter((f) => f.targetType === "ATTRACTION" && f.attractionId)
            .map((f) => f.attractionId!);
        userFavoriteFoodIds = favs
            .filter((f) => f.targetType === "FOOD" && f.foodId)
            .map((f) => f.foodId!);
    }

    return (
        <CityDetailClient
            city={{
                id: city.id,
                nameEn: city.nameEn,
                nameZh: city.nameZh,
                descEn: city.descEn,
                lat: city.lat,
                lng: city.lng,
                heroImage: city.heroImage,
            }}
            attractions={city.attractions}
            foods={city.foods}
            userFavoriteAttractionIds={userFavoriteAttractionIds}
            userFavoriteFoodIds={userFavoriteFoodIds}
        />
    );
}
