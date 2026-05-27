"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

const errorMessages: Record<string, string> = {
  OAuthSignin: "Error signing in with OAuth provider.",
  OAuthCallback: "Error in OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create account with this email.",
  Callback: "Error in callback.",
  OAuthAccountNotLinked: "This email is already linked to a different provider.",
  EmailSignin: "Error sending email sign-in link.",
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An authentication error occurred.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";
  const message = errorMessages[error] ?? errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Authentication Error</h1>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <Link href="/auth/signin" className="inline-block bg-red-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
