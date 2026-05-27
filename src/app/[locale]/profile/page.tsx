import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { User, Heart, Star } from "lucide-react";
import StarRating from "@/components/ui/StarRating";

export async function generateMetadata() {
    const t = await getTranslations("profile");
    return { title: t("title") };
}

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/signin");

    const t = await getTranslations("profile");

    const [favAttractions, favFoods, reviews] = await Promise.all([
        prisma.favorite.findMany({
            where: { userId: session.user.id, targetType: "ATTRACTION" },
            include: { attraction: { select: { id: true, nameEn: true, slug: true, images: true, cityId: true, city: { select: { slug: true } } } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.favorite.findMany({
            where: { userId: session.user.id, targetType: "FOOD" },
            include: { food: { select: { id: true, nameEn: true, slug: true, images: true } } },
            orderBy: { createdAt: "desc" },
        }),
        prisma.review.findMany({
            where: { userId: session.user.id },
            include: {
                attraction: { select: { nameEn: true, slug: true } },
                food: { select: { nameEn: true, slug: true } },
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* User header */}
            <div className="flex items-center gap-4 mb-12">
                {session.user.image ? (
                    <Image src={session.user.image} alt="" width={80} height={80} className="rounded-full" />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{session.user.name}</h1>
                    <p className="text-gray-500">{session.user.email}</p>
                </div>
            </div>

            {/* Favorites */}
            <section className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" /> {t("favorites")}
                </h2>
                {favAttractions.length === 0 && favFoods.length === 0 ? (
                    <p className="text-gray-400">{t("noFavorites")}</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {favAttractions.filter(f => f.attraction).map((fav) => (
                            <Link key={fav.id} href={`/cities/${fav.attraction!.city.slug}`} className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-32 bg-gray-100">
                                    {fav.attraction!.images && JSON.parse(fav.attraction!.images)[0] ? (
                                        <Image src={JSON.parse(fav.attraction!.images)[0] as string} alt="" fill className="object-cover" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">🏛</div>}
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{fav.attraction!.nameEn}</p>
                                    <p className="text-xs text-gray-400">Attraction</p>
                                </div>
                            </Link>
                        ))}
                        {favFoods.filter(f => f.food).map((fav) => (
                            <Link key={fav.id} href={`/food/${fav.food!.slug}`} className="group block rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-32 bg-gray-100">
                                    {fav.food!.images && JSON.parse(fav.food!.images)[0] ? (
                                        <Image src={JSON.parse(fav.food!.images)[0] as string} alt="" fill className="object-cover" />
                                    ) : <div className="w-full h-full flex items-center justify-center text-3xl">🍜</div>}
                                </div>
                                <div className="p-2">
                                    <p className="text-xs font-medium text-gray-800 line-clamp-1">{fav.food!.nameEn}</p>
                                    <p className="text-xs text-gray-400">Food</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Reviews */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400" /> {t("myReviews")}
                </h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-400">{t("noReviews")}</p>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((r) => (
                            <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <Link
                                        href={r.attraction ? `/cities/${r.attraction.slug}` : `/food/${r.food?.slug}`}
                                        className="font-medium text-gray-900 hover:text-red-600"
                                    >
                                        {r.attraction?.nameEn ?? r.food?.nameEn}
                                    </Link>
                                    <span className="text-xs text-gray-400">{r.createdAt.toLocaleDateString()}</span>
                                </div>
                                <StarRating rating={r.rating} size="sm" className="mb-2" />
                                <p className="text-sm text-gray-600">{r.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
