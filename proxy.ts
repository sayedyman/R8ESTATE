import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  // 1. Execute Supabase session refresh first
  const response = await updateSession(request)

  // 2. Fetch the NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token
  const isOnboardingCompleted = token?.isOnboardingCompleted === true
  const { pathname } = request.nextUrl

  // Protected paths check
  const isProtectedRoute = pathname.startsWith("/dashboard")

  // Authentication paths check
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup")

  if (isProtectedRoute) {
    if (!isLoggedIn) {
      // Redirect to login page and preserve the redirect path
      const loginUrl = new URL("/login", request.nextUrl.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (!isOnboardingCompleted) {
      // User is logged in but hasn't completed onboarding. Redirect to goal selection page.
      return NextResponse.redirect(new URL("/onboarding/goal", request.nextUrl.origin))
    }
  }

  // Redirect authenticated, completed onboarding users away from onboarding routes
  if (pathname.startsWith("/onboarding") && isLoggedIn && isOnboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin))
  }

  if (isAuthRoute && isLoggedIn) {
    // If logged in, redirect user away from auth pages depending on onboarding status
    if (isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin))
    } else {
      return NextResponse.redirect(new URL("/onboarding/goal", request.nextUrl.origin))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - asset images/logos
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
