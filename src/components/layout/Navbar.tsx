"use client";

import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/cities", label: t("cities") },
    { href: "/food", label: t("food") },
    { href: "/travel-guide", label: t("travelGuide") },
    { href: "/ai", label: t("ai") },
  ];

  const currentLocale = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  function switchLocale(code: string) {
    router.replace(pathname, { locale: code });
    setLangOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-red-600">
            <span className="text-2xl">🇨🇳</span>
            <span>Awesome China</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-red-600",
                  pathname === link.href ? "text-red-600" : "text-gray-600"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLocale.flag} {currentLocale.code.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                  {LOCALES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2",
                        l.code === locale ? "text-red-600 font-medium" : "text-gray-700"
                      )}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserOpen(false)}>
                      <User className="w-4 h-4" /> {t("profile")}
                    </Link>
                    {session.user.role === "ADMIN" && (
                      <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserOpen(false)}>
                        <Settings className="w-4 h-4" /> {t("admin")}
                      </Link>
                    )}
                    <button
                      onClick={() => { void signOut(); setUserOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" /> {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                {t("signIn")}
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-gray-700 hover:text-red-600 py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { switchLocale(l.code); setMobileOpen(false); }}
                className={cn(
                  "text-xs px-2 py-1 rounded border",
                  l.code === locale ? "border-red-400 text-red-600 bg-red-50" : "border-gray-200 text-gray-600"
                )}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          {!session?.user && (
            <Link
              href="/auth/signin"
              className="block bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              {t("signIn")}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
