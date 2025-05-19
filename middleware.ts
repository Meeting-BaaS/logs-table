import { type NextRequest, NextResponse } from "next/server"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

if (!process.env.AUTH_COOKIE_NAME) {
  throw new Error("AUTH_COOKIE_NAME environment variable is not defined")
}

const authAppUrl = getAuthAppUrl()

export async function middleware(request: NextRequest) {
  // Check if auth cookie exists before processing request
  // Fetch session in RSC/APIs to further protect a route
  const authCookieName = process.env.AUTH_COOKIE_NAME
  const cookie = authCookieName ? request.cookies.get(authCookieName) : undefined
  const response = NextResponse.next()

  const signInUrl = `${authAppUrl}/sign-in`

  // Get the origin from X-Forwarded-Host header if available, otherwise use nextUrl.origin
  const forwardedHost = request.headers.get("x-forwarded-host")
  const protocol = request.headers.get("x-forwarded-proto") || "https"
  const appUrl = forwardedHost ? `${protocol}://${forwardedHost}` : request.nextUrl.origin

  const redirectTo = `${appUrl}${request.nextUrl.pathname}${request.nextUrl.search}`

  console.log("redirectTo", redirectTo)

  if (!cookie) {
    const newUrl = new URL(`${signInUrl}${request.nextUrl.search}`)
    newUrl.searchParams.set("redirectTo", redirectTo)
    return NextResponse.redirect(newUrl)
  }

  // Setting a custom header so that RSCs can handle redirection if session not found
  response.headers.set("x-redirect-to", redirectTo)

  return response
}

// skipping static and api routes
// Api routes are protected by fetch session request
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
}
