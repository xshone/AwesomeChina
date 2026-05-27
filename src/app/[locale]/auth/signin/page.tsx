"use client";

import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function SignInPage() {
    const t = useTranslations("auth");
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleCredentials(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await signIn("credentials", {
            email,
            password,
            callbackUrl,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            setError("Invalid email or password");
        } else {
            window.location.href = callbackUrl;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-3">🇨🇳</div>
                    <h1 className="text-2xl font-bold text-gray-900">{t("signIn")}</h1>
                </div>

                {/* OAuth */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => void signIn("google", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {t("continueGoogle")}
                    </button>
                    <button
                        onClick={() => void signIn("github", { callbackUrl })}
                        className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white rounded-xl px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        {t("continueGitHub")}
                    </button>
                </div>

                {/* Divider */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                    <div className="relative text-center text-xs text-gray-400 bg-white px-2 w-fit mx-auto">{t("orEmail")}</div>
                </div>

                {/* Credentials form */}
                <form onSubmit={handleCredentials} className="space-y-4">
                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("email")}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t("password")}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? "..." : t("signIn")}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-4">
                    {t("noAccount")}{" "}
                    <Link href="/auth/signup" className="text-red-600 font-medium hover:underline">{t("signUp")}</Link>
                </p>
            </div>
        </div>
    );
}
