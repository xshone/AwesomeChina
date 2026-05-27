import createMiddleware from "next-intl/middleware";
import { auth } from "@/lib/auth";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ["/profile", "/admin"];

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Strip locale prefix to check path
    const pathnameWithoutLocale = pathname.replace(/^\/(en|zh|ja|ko|fr)/, "") || "/";

    const isProtected = protectedPaths.some((p) =>
        pathnameWithoutLocale.startsWith(p)
    );

    if (isProtected) {
        const session = await auth();
        if (!session?.user) {
            const signInUrl = new URL(`/auth/signin`, request.url);
            signInUrl.searchParams.set("callbackUrl", request.url);
            return NextResponse.redirect(signInUrl);
        }
        if (
            pathnameWithoutLocale.startsWith("/admin") &&
            session.user.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
