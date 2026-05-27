"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import StarRating from "./StarRating";
import AuthModal from "./AuthModal";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
    id: string;
    rating: number;
    content: string;
    createdAt: string;
    user: { name: string | null; image: string | null };
}

interface ReviewSectionProps {
    targetType: "ATTRACTION" | "FOOD";
    targetId: string;
    reviews: Review[];
    isLoggedIn: boolean;
}

export default function ReviewSection({ targetType, targetId, reviews: initial, isLoggedIn }: ReviewSectionProps) {
    const t = useTranslations("review");
    const tCommon = useTranslations("common");
    const [reviews, setReviews] = useState(initial);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoggedIn) { setShowAuthModal(true); return; }
        if (rating === 0) { toast.error("Please select a rating"); return; }
        if (content.trim().length < 10) { toast.error("Review must be at least 10 characters"); return; }

        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetType, targetId, rating, content }),
            });
            if (!res.ok) throw new Error();
            const newReview = await res.json() as Review;
            setReviews([newReview, ...reviews]);
            setRating(0);
            setContent("");
            toast.success("Review submitted!");
        } catch {
            toast.error("Failed to submit review");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("title")} ({reviews.length})</h2>

            {/* Write review form */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("rating")}</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={cn(
                                        "text-2xl transition-transform hover:scale-110",
                                        star <= rating ? "text-amber-400" : "text-gray-200"
                                    )}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t("content")}</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            placeholder={isLoggedIn ? "Share your experience..." : t("loginRequired")}
                            onClick={() => { if (!isLoggedIn) setShowAuthModal(true); }}
                            readOnly={!isLoggedIn}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? tCommon("loading") : t("submit")}
                    </button>
                </form>
            </div>

            {/* Reviews list */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
                ) : (
                    reviews.map((r) => (
                        <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5">
                            <div className="flex items-start gap-3">
                                {r.user.image ? (
                                    <Image src={r.user.image} alt="" width={40} height={40} className="rounded-full shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-gray-900">{r.user.name ?? "Anonymous"}</span>
                                        <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <StarRating rating={r.rating} size="sm" className="mb-2" />
                                    <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
}
