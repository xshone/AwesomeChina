"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CityFormProps {
    initial?: {
        id?: string;
        slug?: string;
        nameEn?: string;
        nameZh?: string;
        nameJa?: string;
        nameKo?: string;
        nameFr?: string;
        descEn?: string;
        descZh?: string;
        heroImage?: string;
        lat?: number;
        lng?: number;
        published?: boolean;
    };
}

export default function CityForm({ initial = {} }: CityFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        slug: initial.slug ?? "",
        nameEn: initial.nameEn ?? "",
        nameZh: initial.nameZh ?? "",
        nameJa: initial.nameJa ?? "",
        nameKo: initial.nameKo ?? "",
        nameFr: initial.nameFr ?? "",
        descEn: initial.descEn ?? "",
        descZh: initial.descZh ?? "",
        heroImage: initial.heroImage ?? "",
        lat: String(initial.lat ?? ""),
        lng: String(initial.lng ?? ""),
        published: initial.published ?? true,
    });

    function set(field: string, value: string | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const method = initial.id ? "PATCH" : "POST";
            const url = initial.id ? `/api/admin/cities/${initial.id}` : "/api/admin/cities";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, lat: parseFloat(form.lat), lng: parseFloat(form.lng) }),
            });
            if (!res.ok) throw new Error();
            toast.success(initial.id ? "City updated!" : "City created!");
            router.push("/admin/cities");
            router.refresh();
        } catch {
            toast.error("Failed to save city");
        } finally {
            setLoading(false);
        }
    }

    const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                    <input required value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Chinese) *</label>
                    <input required value={form.nameZh} onChange={(e) => set("nameZh", e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Japanese)</label>
                    <input value={form.nameJa} onChange={(e) => set("nameJa", e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name (Korean)</label>
                    <input value={form.nameKo} onChange={(e) => set("nameKo", e.target.value)} className={inputClass} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input required value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="e.g. beijing" className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image URL *</label>
                <input required value={form.heroImage} onChange={(e) => set("heroImage", e.target.value)} placeholder="https://..." className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
                    <input required type="number" step="any" value={form.lat} onChange={(e) => set("lat", e.target.value)} className={inputClass} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
                    <input required type="number" step="any" value={form.lng} onChange={(e) => set("lng", e.target.value)} className={inputClass} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English) *</label>
                <textarea required rows={4} value={form.descEn} onChange={(e) => set("descEn", e.target.value)} className={inputClass} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Chinese) *</label>
                <textarea required rows={4} value={form.descZh} onChange={(e) => set("descZh", e.target.value)} className={inputClass} />
            </div>
            <div className="flex items-center gap-2">
                <input type="checkbox" id="published" checked={form.published} onChange={(e) => set("published", e.target.checked)} className="rounded" />
                <label htmlFor="published" className="text-sm text-gray-700">Published</label>
            </div>
            <button type="submit" disabled={loading}
                className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                {loading ? "Saving..." : initial.id ? "Update City" : "Create City"}
            </button>
        </form>
    );
}
