import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
    const t = useTranslations("footer");

    return (
        <footer className="bg-gray-900 text-gray-300 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 font-bold text-xl text-white mb-3">
                            <span className="text-2xl">🇨🇳</span>
                            <span>Awesome China</span>
                        </div>
                        <p className="text-sm text-gray-400">{t("tagline")}</p>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">{t("explore")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/cities" className="hover:text-white transition-colors">{t("cities")}</Link></li>
                            <li><Link href="/food" className="hover:text-white transition-colors">{t("food")}</Link></li>
                            <li><Link href="/travel-guide" className="hover:text-white transition-colors">{t("travelGuide")}</Link></li>
                        </ul>
                    </div>

                    {/* Plan */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">{t("plan")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/itinerary" className="hover:text-white transition-colors">{t("itinerary")}</Link></li>
                            <li><Link href="/ai" className="hover:text-white transition-colors">{t("aiGuide")}</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="text-white font-semibold mb-3">{t("connect")}</h3>
                        <div className="flex gap-3 text-xl">
                            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">𝕏</a>
                            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">📸</a>
                            <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">▶</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} Awesome China. {t("rights")}
                </div>
            </div>
        </footer>
    );
}
