"use client";

import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import AuthModal from "./AuthModal";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  targetType: "ATTRACTION" | "FOOD";
  targetId: string;
  initialFavorited?: boolean;
  className?: string;
}

export default function FavoriteButton({
  targetType,
  targetId,
  initialFavorited = false,
  className,
}: FavoriteButtonProps) {
  const t = useTranslations("food");
  const { data: session } = useSession();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  async function handleClick() {
    if (!session?.user) {
      setShowAuthModal(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, targetId }),
      });
      const data = await res.json() as { favorited: boolean };
      setFavorited(data.favorited);
      toast.success(data.favorited ? t("favorite") : t("unfavorite"));
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        aria-label={favorited ? t("unfavorite") : t("favorite")}
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg border transition-all text-sm font-medium",
          favorited
            ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
            : "bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500",
          loading && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
        <span>{favorited ? t("unfavorite") : t("favorite")}</span>
      </button>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
