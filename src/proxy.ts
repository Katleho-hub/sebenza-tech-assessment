import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/server/session";
import { authRoutes, protectedRoutes } from "@/app/constants/routes";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  const isProtectedRoute = protectedRoutes.some((route) => path === route);
  const isAuthRoute = (authRoutes as readonly string[]).includes(path);

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && session?.userId && path !== "/") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Intercept all request paths except for:
     * - api routes (_next/static, _next/image)
     * - favicon images (favicon.ico)
     * - standard media static extensions (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
