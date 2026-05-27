import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { parseImages } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import { MapPin, UtensilsCrossed, Flame, Bot, Shield, Train } from "lucide-react";

export default async function HomePage() {
    const t = await getTranslations("home");
    const tCommon = await getTranslations("common");

    const [cities, featuredFoods] = await Promise.all([
        prisma.city.findMany({
            where: { published: true },
            take: 6,
            include: {
                _count: { select: { attractions: true, foods: true } },
            },
            orderBy: { createdAt: "asc" },
        }),
        prisma.food.findMany({
            where: { published: true },
            take: 6,
            orderBy: { createdAt: "asc" },
        }),
    ]);

    const whyItems = [
        { icon: MapPin, title: t("whyHistory"), desc: t("whyHistoryDesc"), color: "bg-amber-50 text-amber-600" },
        { icon: UtensilsCrossed, title: t("whyCuisine"), desc: t("whyCuisineDesc"), color: "bg-red-50 text-red-600" },
        { icon: Train, title: t("whyModern"), desc: t("whyModernDesc"), color: "bg-blue-50 text-blue-600" },
        { icon: Shield, title: t("whySafe"), desc: t("whySafeDesc"), color: "bg-green-50 text-green-600" },
    ];

    return (
        <div>
            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-900 via-red-700 to-orange-600">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600')" }}
                />
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-6 border border-white/30">
                        <Flame className="w-4 h-4" />
                        <span>Discover China's Best-Kept Secrets</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
                        {t("heroTitle")}
                    </h1>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                        {t("heroSubtitle")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/cities"
                            className="bg-white text-red-700 font-semibold px-8 py-4 rounded-xl hover:bg-red-50 transition-all shadow-lg hover:shadow-xl text-lg"
                        >
                            {t("heroCta")}
                        </Link>
                        <Link
                            href="/ai"
                            className="flex items-center gap-2 justify-center bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/30 transition-all border border-white/30 text-lg"
                        >
                            <Bot className="w-5 h-5" />
                            {t("askAI")}
                        </Link>
                    </div>
                </div>
                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1200 80" className="w-full fill-white">
                        <path d="M0,60 C200,20 400,80 600,50 C800,20 1000,70 1200,40 L1200,80 L0,80 Z" />
                    </svg>
                </div>
            </section>

            {/* ── Featured Cities ──────────────────────────────── */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t("featuredCities")}</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">{t("featuredCitiesDesc")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cities.map((city) => (
                        <Link key={city.id} href={`/cities/${city.slug}`} className="group block">
                            <div className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <div className="relative h-52">
                                    <Image
                                        src={city.heroImage}
                                        alt={city.nameEn}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-xl font-bold">{city.nameEn}</h3>
                                        <p className="text-sm text-white/80">{city.nameZh}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white flex items-center justify-between">
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{city._count.attractions} spots</span>
                                        <span className="flex items-center gap-1"><UtensilsCrossed className="w-3.5 h-3.5" />{city._count.foods} foods</span>
                                    </div>
                                    <span className="text-red-600 text-sm font-medium group-hover:underline">{tCommon("viewDetails")} →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Link href="/cities" className="inline-flex items-center gap-2 border border-red-200 text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
                        {t("viewAllCities")} →
                    </Link>
                </div>
            </section>

            {/* ── Why Visit ────────────────────────────────────── */}
            <section className="bg-gray-50 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t("whyVisit")}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyItems.map(({ icon: Icon, title, desc, color }) => (
                            <div key={title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Food Highlights ──────────────────────────────── */}
            <section className="py-20 px-4 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{t("foodHighlights")}</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">{t("foodHighlightsDesc")}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {featuredFoods.map((food) => {
                        const imgs = parseImages(food.images);
                        return (
                            <Link key={food.id} href={`/food/${food.slug}`} className="group block">
                                <div className="rounded-xl overflow-hidden aspect-square relative shadow hover:shadow-lg transition-all">
                                    {imgs[0] ? (
                                        <Image src={imgs[0]} alt={food.nameEn} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🍜</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <p className="text-white text-xs font-semibold leading-tight">{food.nameEn}</p>
                                        {food.spiceLevel > 0 && (
                                            <div className="flex gap-0.5 mt-1">
                                                {Array.from({ length: food.spiceLevel }, (_, i) => (
                                                    <span key={i} className="text-xs">🌶</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className="text-center mt-10">
                    <Link href="/food" className="inline-flex items-center gap-2 border border-red-200 text-red-600 font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors">
                        {t("viewAllFoods")} →
                    </Link>
                </div>
            </section>

            {/* ── AI CTA ───────────────────────────────────────── */}
            <section className="bg-gradient-to-r from-red-600 to-orange-500 py-20 px-4">
                <div className="max-w-3xl mx-auto text-center text-white">
                    <div className="text-5xl mb-4">🤖</div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("planTrip")}</h2>
                    <p className="text-lg text-white/80 mb-8">{t("planTripDesc")}</p>
                    <Link
                        href="/ai"
                        className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-4 rounded-xl hover:bg-red-50 transition-colors text-lg shadow-lg"
                    >
                        <Bot className="w-5 h-5" />
                        {t("askAI")}
                    </Link>
                </div>
            </section>
        </div>
    );
}
