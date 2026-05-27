import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL ?? "https://awesome-china.vercel.app";
const LOCALES = ["en", "zh", "ja", "ko", "fr"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [cities, foods] = await Promise.all([
        prisma.city.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        prisma.food.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    const staticPaths = ["", "/cities", "/food", "/travel-guide", "/ai"];
    const entries: MetadataRoute.Sitemap = [];

    for (const locale of LOCALES) {
        for (const path of staticPaths) {
            entries.push({ url: `${BASE_URL}/${locale}${path}`, changeFrequency: "weekly", priority: path === "" ? 1 : 0.8 });
        }
        for (const city of cities) {
            entries.push({ url: `${BASE_URL}/${locale}/cities/${city.slug}`, lastModified: city.updatedAt, changeFrequency: "weekly", priority: 0.7 });
        }
        for (const food of foods) {
            entries.push({ url: `${BASE_URL}/${locale}/food/${food.slug}`, lastModified: food.updatedAt, changeFrequency: "monthly", priority: 0.6 });
        }
    }

    return entries;
}
