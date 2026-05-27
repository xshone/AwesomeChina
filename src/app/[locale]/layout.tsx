import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Awesome China — Discover China's Cities, Food & Culture",
    template: "%s | Awesome China",
  },
  description:
    "Your ultimate guide to traveling China. Explore iconic cities, taste incredible food, and plan your perfect trip with AI assistance.",
  keywords: ["China travel", "Chinese food", "Beijing", "Shanghai", "Chengdu", "China tourism"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://awesome-china.vercel.app",
    siteName: "Awesome China",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "zh" | "ja" | "ko" | "fr")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 antialiased">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
