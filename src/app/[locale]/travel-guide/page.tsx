import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import type { TipCategory } from "@prisma/client";

export async function generateMetadata() {
  const t = await getTranslations("travelGuide");
  return { title: t("title"), description: t("subtitle") };
}

const CATEGORY_CONFIG: Record<TipCategory, { emoji: string; color: string }> = {
  VISA:      { emoji: "🛂", color: "bg-blue-50 border-blue-200" },
  TRANSPORT: { emoji: "🚄", color: "bg-green-50 border-green-200" },
  PAYMENT:   { emoji: "💳", color: "bg-purple-50 border-purple-200" },
  APPS:      { emoji: "📱", color: "bg-yellow-50 border-yellow-200" },
  LANGUAGE:  { emoji: "💬", color: "bg-pink-50 border-pink-200" },
  SAFETY:    { emoji: "🛡", color: "bg-red-50 border-red-200" },
  HEALTH:    { emoji: "🏥", color: "bg-emerald-50 border-emerald-200" },
  ETIQUETTE: { emoji: "🤝", color: "bg-orange-50 border-orange-200" },
};

// Fallback static tips when DB is empty
const FALLBACK_TIPS = [
  {
    id: "1",
    category: "VISA" as TipCategory,
    titleEn: "China Visa Requirements",
    contentEn: "Most foreign nationals require a visa to enter China. Apply at your nearest Chinese embassy or consulate. The standard tourist visa (L visa) requires a passport, application form, photo, itinerary, and hotel bookings. Processing takes 4–7 business days. Some nationalities enjoy visa-free or visa-on-arrival access — check the latest list before applying.",
  },
  {
    id: "2",
    category: "TRANSPORT" as TipCategory,
    titleEn: "Getting Around China",
    contentEn: "China has one of the world's best high-speed rail networks. The 'G' trains (high-speed) connect major cities at up to 350 km/h. Book tickets on the 12306 app or Trip.com. Within cities, metro systems are efficient, clean, and cheap. Didi (Chinese Uber) works well for short trips. Domestic flights are also affordable.",
  },
  {
    id: "3",
    category: "PAYMENT" as TipCategory,
    titleEn: "Payment & Money in China",
    contentEn: "China is largely cashless — WeChat Pay and Alipay dominate. As a foreigner, you can now link international Visa/Mastercard cards to WeChat Pay or Alipay. Cash (RMB/Yuan) is widely accepted as a backup. ATMs that accept foreign cards are available in major cities (look for UnionPay-compatible ones). Exchange rates at banks are best.",
  },
  {
    id: "4",
    category: "APPS" as TipCategory,
    titleEn: "Essential Apps for China",
    contentEn: "Install before you arrive: 1) VPN (ExpressVPN/NordVPN) — Google, WhatsApp, and most Western apps are blocked. 2) WeChat — messaging, payments, everything. 3) Alipay — payments. 4) Didi — ride-hailing. 5) Baidu Maps — navigation (Google Maps works poorly). 6) Trip.com — hotels and transport booking. 7) Translate — download Google Translate offline Chinese pack.",
  },
  {
    id: "5",
    category: "LANGUAGE" as TipCategory,
    titleEn: "Language Tips",
    contentEn: "Mandarin Chinese is the official language. English is spoken in hotels and tourist areas in major cities, but limited elsewhere. Learn a few key phrases: 你好 (Nǐ hǎo — Hello), 谢谢 (Xièxiè — Thank you), 多少钱 (Duōshǎo qián — How much?). Download the Google Translate app with offline Chinese pack. Showing restaurant menus or addresses on your phone works well.",
  },
  {
    id: "6",
    category: "SAFETY" as TipCategory,
    titleEn: "Safety in China",
    contentEn: "China is generally very safe for tourists. Violent crime against foreigners is rare. Petty theft can occur in crowded tourist spots — keep valuables secure. Be cautious of tourist scams (tea ceremony scams, fake art galleries). Register your stay at your hotel (they handle this automatically). Keep a copy of your passport. Emergency: 110 (police), 120 (ambulance).",
  },
  {
    id: "7",
    category: "HEALTH" as TipCategory,
    titleEn: "Health & Vaccinations",
    contentEn: "No mandatory vaccinations are required for China. Recommended: Hepatitis A, Typhoid (if visiting rural areas), and stay current on routine vaccines. Air quality can be poor in some cities — consider a mask on high-pollution days. Tap water is not safe to drink — always use bottled or boiled water. International hospitals in major cities have English-speaking staff.",
  },
  {
    id: "8",
    category: "ETIQUETTE" as TipCategory,
    titleEn: "Cultural Etiquette",
    contentEn: "Remove shoes when entering homes. Use both hands when giving or receiving business cards or gifts. Don't stick chopsticks upright in rice (funeral connotation). Tipping is not customary and may be refused. Dress conservatively when visiting temples. Bargaining is expected in markets but not in malls. Public displays of affection are generally discouraged. Photography may be restricted in some sites.",
  },
];

export default async function TravelGuidePage() {
  const t = await getTranslations("travelGuide");

  const dbTips = await prisma.travelTip.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  const tips = dbTips.length > 0 ? dbTips : FALLBACK_TIPS;

  const grouped = tips.reduce<Record<string, typeof tips>>((acc, tip) => {
    const cat = tip.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tip);
    return acc;
  }, {});

  const categoryLabel: Record<string, string> = {
    VISA: t("visa"), TRANSPORT: t("transport"), PAYMENT: t("payment"),
    APPS: t("apps"), LANGUAGE: t("language"), SAFETY: t("safety"),
    HEALTH: t("health"), ETIQUETTE: t("etiquette"),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      {/* Category nav pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {Object.keys(grouped).map((cat) => {
          const cfg = CATEGORY_CONFIG[cat as TipCategory];
          return (
            <a key={cat} href={`#${cat}`} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border ${cfg.color} hover:opacity-80 transition-opacity`}>
              {cfg.emoji} {categoryLabel[cat]}
            </a>
          );
        })}
      </div>

      <div className="space-y-14">
        {Object.entries(grouped).map(([cat, catTips]) => {
          const cfg = CATEGORY_CONFIG[cat as TipCategory];
          return (
            <section key={cat} id={cat}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border ${cfg.color}`}>
                  {cfg.emoji}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{categoryLabel[cat]}</h2>
              </div>
              <div className="space-y-4">
                {catTips.map((tip) => (
                  <div key={tip.id} className={`rounded-2xl border p-6 ${cfg.color}`}>
                    <h3 className="font-semibold text-gray-900 mb-3">{tip.titleEn}</h3>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{tip.contentEn}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
