"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { cn, parseImages } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { Link } from "@/i18n/navigation";

const CityMap = dynamic(() => import("./CityMap"), { ssr: false });

interface Attraction {
  id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  descEn: string;
  category: string;
  images: string;
  lat: number | null;
  lng: number | null;
  rating: number;
}

interface Food {
  id: string;
  slug: string;
  nameEn: string;
  nameZh: string;
  descEn: string;
  category: string;
  images: string;
  spiceLevel: number;
  priceRange: string;
}

interface CityDetailClientProps {
  city: {
    id: string;
    nameEn: string;
    nameZh: string;
    descEn: string;
    lat: number;
    lng: number;
    heroImage: string;
  };
  attractions: Attraction[];
  foods: Food[];
  userFavoriteAttractionIds: string[];
  userFavoriteFoodIds: string[];
}

export default function CityDetailClient({
  city,
  attractions,
  foods,
  userFavoriteAttractionIds,
  userFavoriteFoodIds,
}: CityDetailClientProps) {
  const t = useTranslations("cities");
  const tCommon = useTranslations("common");
  const [tab, setTab] = useState<"overview" | "attractions" | "food" | "map">("overview");

  const tabs = [
    { id: "overview", label: t("overview"), icon: "🏙" },
    { id: "attractions", label: t("attractions"), icon: "🗺" },
    { id: "food", label: t("foods"), icon: "🍜" },
    { id: "map", label: t("map"), icon: "📍" },
  ] as const;

  return (
    <div>
      {/* Hero */}
      <div className="relative h-80 md:h-[500px]">
        <Image src={city.heroImage} alt={city.nameEn} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">{city.nameEn}</h1>
          <p className="text-xl text-white/70">{city.nameZh}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-1.5 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                tab === id
                  ? "border-red-500 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              )}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overview */}
        {tab === "overview" && (
          <div className="max-w-3xl">
            <p className="text-lg text-gray-700 leading-relaxed">{city.descEn}</p>
          </div>
        )}

        {/* Attractions */}
        {tab === "attractions" && (
          <div>
            {attractions.length === 0 ? (
              <p className="text-gray-400">{t("noAttractions")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractions.map((a) => {
                  const imgs = parseImages(a.images);
                  return (
                    <div key={a.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        {imgs[0] ? (
                          <Image src={imgs[0]} alt={a.nameEn} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🏛</div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-gray-900">{a.nameEn}</h3>
                          <FavoriteButton
                            targetType="ATTRACTION"
                            targetId={a.id}
                            initialFavorited={userFavoriteAttractionIds.includes(a.id)}
                            className="ml-2 shrink-0"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{a.nameZh}</p>
                        {a.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <StarRating rating={a.rating} size="sm" />
                            <span className="text-xs text-gray-500">{a.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <p className="text-sm text-gray-500 line-clamp-2">{a.descEn}</p>
                        <Link href={`/cities/${city.id}/${a.slug}`} className="mt-3 inline-block text-sm text-red-600 font-medium hover:underline">
                          {tCommon("viewDetails")} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Food */}
        {tab === "food" && (
          <div>
            {foods.length === 0 ? (
              <p className="text-gray-400">{t("noFoods")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {foods.map((f) => {
                  const imgs = parseImages(f.images);
                  return (
                    <div key={f.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        {imgs[0] ? (
                          <Image src={imgs[0]} alt={f.nameEn} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-4xl">🍜</div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-gray-900">{f.nameEn}</h3>
                          <FavoriteButton
                            targetType="FOOD"
                            targetId={f.id}
                            initialFavorited={userFavoriteFoodIds.includes(f.id)}
                            className="ml-2 shrink-0"
                          />
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{f.nameZh}</p>
                        {f.spiceLevel > 0 && (
                          <div className="flex gap-0.5 mb-2">
                            {Array.from({ length: f.spiceLevel }, (_, i) => <span key={i}>🌶</span>)}
                          </div>
                        )}
                        <p className="text-sm text-gray-500 line-clamp-2">{f.descEn}</p>
                        <Link href={`/food/${f.slug}`} className="mt-3 inline-block text-sm text-red-600 font-medium hover:underline">
                          {tCommon("viewDetails")} →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Map */}
        {tab === "map" && (
          <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200">
            <CityMap
              center={[city.lat, city.lng]}
              attractions={attractions
                .filter((a) => a.lat && a.lng)
                .map((a) => ({
                  id: a.id,
                  name: a.nameEn,
                  lat: a.lat!,
                  lng: a.lng!,
                  type: "attraction",
                }))}
              foods={foods
                .filter(() => false) // Foods don't have lat/lng in schema
                .map(() => ({ id: "", name: "", lat: 0, lng: 0, type: "food" as const }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
