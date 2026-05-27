import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { parseImages } from "@/lib/utils";
import type { FoodCategory, PriceRange } from "@prisma/client";

export async function generateMetadata() {
    const t = await getTranslations("food");
    return { title: t("title"), description: t("subtitle") };
}

const CATEGORY_EMOJIS: Record<string, string> = {
    NOODLES: "🍜", DUMPLINGS: "🥟", HOTPOT: "🍲", STREET_FOOD: "🥢",
    DESSERT: "🍡", SEAFOOD: "🦐", ROASTED: "🍖", VEGETARIAN: "🥦",
    DIM_SUM: "🫕", SOUP: "🍵",
};

export default async function FoodPage() {
    const t = await getTranslations("food");
    const tCommon = await getTranslations("common");

    const foods = await prisma.food.findMany({
        where: { published: true },
        include: { city: { select: { nameEn: true, slug: true } } },
        orderBy: { createdAt: "asc" },
    });

    const categories = Array.from(new Set(foods.map((f) => f.category)));

    function spiceLevelLabel(level: number) {
        const labels = [t("noSpice"), t("mild"), t("medium"), t("hot"), t("veryHot"), t("extreme")];
        return labels[level] ?? t("noSpice");
    }

    function priceLabel(p: PriceRange) {
        if (p === "BUDGET") return t("budget");
        if (p === "UPSCALE") return t("upscale");
        return t("mediumPrice");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 justify-center mb-10">
                {categories.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 bg-gray-100 text-gray-700 text-sm px-3 py-1.5 rounded-full">
                        {CATEGORY_EMOJIS[cat] ?? "🍽"} {cat.replace(/_/g, " ")}
                    </span>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {foods.map((food) => {
                    const imgs = parseImages(food.images);
                    return (
                        <Link key={food.id} href={`/food/${food.slug}`} className="group block">
                            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all h-full flex flex-col">
                                <div className="relative h-48">
                                    {imgs[0] ? (
                                        <Image src={imgs[0]} alt={food.nameEn} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-amber-50 flex items-center justify-center text-5xl">
                                            {CATEGORY_EMOJIS[food.category] ?? "🍽"}
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                        {CATEGORY_EMOJIS[food.category]} {food.category.replace(/_/g, " ")}
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-900 mb-0.5">{food.nameEn}</h3>
                                    <p className="text-xs text-gray-400 mb-3">{food.nameZh} · {t("fromCity")} {food.city.nameEn}</p>
                                    <p className="text-sm text-gray-500 line-clamp-2 flex-1">{food.descEn}</p>
                                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                                        <span>{food.spiceLevel > 0 ? Array.from({ length: food.spiceLevel }, () => "🌶").join("") : "—"} {spiceLevelLabel(food.spiceLevel)}</span>
                                        <span className="bg-gray-50 px-2 py-0.5 rounded">{priceLabel(food.priceRange)}</span>
                                    </div>
                                    <span className="mt-3 text-sm text-red-600 font-medium group-hover:underline">{tCommon("viewDetails")} →</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
