import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin, UtensilsCrossed } from "lucide-react";

export async function generateMetadata() {
    const t = await getTranslations("cities");
    return { title: t("title"), description: t("subtitle") };
}

export default async function CitiesPage() {
    const t = await getTranslations("cities");
    const tCommon = await getTranslations("common");

    const cities = await prisma.city.findMany({
        where: { published: true },
        include: { _count: { select: { attractions: true, foods: true } } },
        orderBy: { createdAt: "asc" },
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cities.map((city) => (
                    <Link key={city.id} href={`/cities/${city.slug}`} className="group block">
                        <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                            <div className="relative h-60">
                                <Image
                                    src={city.heroImage}
                                    alt={city.nameEn}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h2 className="text-2xl font-bold">{city.nameEn}</h2>
                                    <p className="text-sm text-white/70">{city.nameZh}</p>
                                </div>
                            </div>
                            <div className="p-5 bg-white flex-1">
                                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{city.descEn}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4 text-sm text-gray-400">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{city._count.attractions} {t("attractions")}</span>
                                        <span className="flex items-center gap-1"><UtensilsCrossed className="w-3.5 h-3.5" />{city._count.foods} {t("foods")}</span>
                                    </div>
                                    <span className="text-red-600 text-sm font-medium group-hover:underline">{tCommon("viewDetails")} →</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
