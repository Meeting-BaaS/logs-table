import type { Session } from "@/lib/auth/types"

/**
 * Function to get session from auth app. Called from RSC/APIs
 * @returns User's session
 */
export async function getAuthSession(requestHeaders: Headers): Promise<Session | null> {
  try {
    const authAppUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL
    if (!authAppUrl) {
      throw new Error("NEXT_PUBLIC_AUTH_APP_URL environment variable is not defined")
    }
    const cookie = requestHeaders.get("cookie") || ""

    const response = await fetch(`${authAppUrl}/api/auth/get-session`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie
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
      authAppUrl: process.env.NEXT_PUBLIC_AUTH_APP_URL,
      hasCookie: !!requestHeaders.get("cookie")
    })
    return null
  }
}
