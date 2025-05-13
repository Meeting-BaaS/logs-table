import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import { getAuthSession } from "@/lib/auth/session"
import type { Metadata, Viewport } from "next"
import { Sofia_Sans } from "next/font/google"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import LayoutRoot from "@/app/layout-root"
import Providers from "@/components/providers"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Logs | Meeting BaaS",
  description: "Access detailed logs of your bots from Meeting BaaS"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
}

const authAppUrl = getAuthAppUrl()

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [requestHeaders, requestCookies] = await Promise.all([headers(), cookies()])
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())
  const jwt = requestCookies.get("jwt")?.value || ""

  if (!session) {
    const redirectTo = requestHeaders.get("x-redirect-to")
    const redirectionUrl = redirectTo
      ? `${authAppUrl}/sign-in?redirectTo=${redirectTo}`
      : `${authAppUrl}/sign-in`
    redirect(redirectionUrl)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sofiaSans.className} flex min-h-screen flex-col antialiased`}>
        <Providers jwt={jwt}>
          <LayoutRoot session={session}>{children}</LayoutRoot>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
