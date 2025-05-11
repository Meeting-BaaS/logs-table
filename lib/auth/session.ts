import type { Session } from "@/lib/auth/types"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

/**
 * Function to get session from auth app.
 * When called from RSC/APIs, cookies need to be passed.
 * @param cookies - Cookies to pass to the auth app
 * @returns User's session
 */
export async function getAuthSession(cookies?: string): Promise<Session | null> {
  try {
    const authAppUrl = getAuthAppUrl()

    const response = await fetch(`${authAppUrl}/api/auth/get-session`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(cookies ? { Cookie: cookies } : {})
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch session: ${response.status} ${response.statusText}`)
    }

    const rawSession = await response.json()

    if (!rawSession?.session) {
      throw new Error("Session not found")
    }

    return {
      ...rawSession,
      session: {
        ...rawSession.session,
        userId: Number(rawSession.session.userId)
      },
      user: {
        ...rawSession.user,
        id: Number(rawSession.user.id)
      }
    }
  } catch (error) {
    console.error("Error fetching auth session:", error, {
      authAppUrl: process.env.NEXT_PUBLIC_AUTH_APP_URL
    })
    return null
  }
}
