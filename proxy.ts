import { getToken } from "next-auth/jwt"
import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function proxy(request: NextRequest) {
  const response = await updateSession(request)

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  // LOG TOKEN FOR DEBUGGING
  console.log("MIDDLEWARE TOKEN:", token)

  const isLoggedIn = !!token
  const isOnboardingCompleted = token?.isOnboardingCompleted === true
  const { pathname } = request.nextUrl

  // Protected paths check
  const protectedPaths = ["/dashboard", "/settings", "/verification", "/manage"]
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path))

  // Authentication paths check
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup")

  if (isProtectedRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.nextUrl.origin)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Allow authenticated users who haven't completed onboarding to reach /dashboard.
    // useAuthSync runs on /dashboard and will persist the draft, then update isOnboardingCompleted.
    // Only block access to other protected routes (settings, verification, etc.) for incomplete users.
    if (!isOnboardingCompleted && pathname !== "/dashboard") {
      return NextResponse.redirect(new URL("/onboarding/goal", request.nextUrl.origin))
    }
  }

  if (pathname.startsWith("/onboarding") && isLoggedIn && isOnboardingCompleted) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin))
  }

  if (isAuthRoute && isLoggedIn) {
    if (isOnboardingCompleted) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin))
    } else {
      // Let authenticated-but-not-onboarded users through to /signup so they can
      // trigger the Google Sign In flow which leads to /dashboard and useAuthSync.
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl.origin))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
