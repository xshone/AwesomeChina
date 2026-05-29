import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { parseImages } from "@/lib/utils";
import FavoriteButton from "@/components/ui/FavoriteButton";
import ReviewSection from "@/components/ui/ReviewSection";
import { Link } from "@/i18n/navigation";

export async function generateStaticParams() {
    const foods = await prisma.food.findMany({ select: { slug: true } });
    return foods.map((f: { slug: string }) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const food = await prisma.food.findUnique({ where: { slug } });
    if (!food) return {};
    return {
        title: `${food.nameEn} — Food Guide`,
        description: food.descEn.slice(0, 160),
    };
}

export default async function FoodDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const session = await auth();
    const t = await getTranslations("food");
    const tCommon = await getTranslations("common");

    const food = await prisma.food.findUnique({
        where: { slug, published: true },
        include: {
            city: { select: { nameEn: true, slug: true } },
            reviews: {
                where: { published: true },
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });

    if (!food) notFound();

    const isFavorited = session?.user?.id
        ? !!(await prisma.favorite.findFirst({
            where: { userId: session.user.id, targetType: "FOOD", foodId: food.id },
        }))
        : false;

    const imgs = parseImages(food.images);

    const spiceEmoji = food.spiceLevel > 0 ? Array.from({ length: food.spiceLevel }, () => "🌶").join("") : "—";

    const priceMap: Record<string, string> = {
        BUDGET: t("budget"),
        MEDIUM: t("mediumPrice"),
        UPSCALE: t("upscale"),
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Back */}
            <Link href="/food" className="text-sm text-gray-500 hover:text-red-600 mb-6 inline-block">
                {tCommon("backToList")}
            </Link>

            <div className="grid md:grid-cols-2 gap-10 mb-12">
                {/* Images */}
                <div className="space-y-3">
                    {imgs[0] ? (
                        <div className="relative h-72 rounded-2xl overflow-hidden">
                            <Image src={imgs[0]} alt={food.nameEn} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="h-72 rounded-2xl bg-amber-50 flex items-center justify-center text-7xl">🍜</div>
                    )}
                    {imgs.length > 1 && (
                        <div className="grid grid-cols-3 gap-2">
                            {imgs.slice(1, 4).map((img, i) => (
                                <div key={i} className="relative h-24 rounded-xl overflow-hidden">
                                    <Image src={img} alt="" fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{food.nameEn}</h1>
                    <p className="text-gray-400 mb-4">{food.nameZh}</p>

                    <div className="flex items-center gap-3 mb-6">
                        <FavoriteButton targetType="FOOD" targetId={food.id} initialFavorited={isFavorited} />
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-28 text-gray-500 font-medium">{t("fromCity")}:</span>
                            <Link href={`/cities/${food.city.slug}`} className="text-red-600 hover:underline">{food.city.nameEn}</Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-28 text-gray-500 font-medium">{t("category")}:</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{food.category.replace(/_/g, " ")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-28 text-gray-500 font-medium">{t("spiceLevel")}:</span>
                            <span>{spiceEmoji}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-28 text-gray-500 font-medium">{t("priceRange")}:</span>
                            <span>{priceMap[food.priceRange]}</span>
                        </div>
                    </div>

                    <p className="mt-6 text-gray-700 leading-relaxed">{food.descEn}</p>
                </div>
            </div>

            {/* Reviews */}
            <ReviewSection
                targetType="FOOD"
                targetId={food.id}
                reviews={food.reviews.map((r) => ({
                    id: r.id,
                    rating: r.rating,
                    content: r.content,
                    createdAt: r.createdAt.toISOString(),
                    user: { name: r.user.name, image: r.user.image },
                }))}
                isLoggedIn={!!session?.user}
            />
        </div>
    );
}
