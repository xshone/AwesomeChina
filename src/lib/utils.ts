import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .trim();
}

export function parseImages(images: string): string[] {
    try {
        return JSON.parse(images) as string[];
    } catch {
        return [images];
    }
}

export const LOCALES = ["en", "zh", "ja", "ko", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
