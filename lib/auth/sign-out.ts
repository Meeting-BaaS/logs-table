/**
 * Function to sign out from auth app. Called from Client
 */
export async function signOut(): Promise<boolean> {
  try {
    const authAppUrl = process.env.NEXT_PUBLIC_AUTH_APP_URL
    if (!authAppUrl) {
      throw new Error("NEXT_PUBLIC_AUTH_APP_URL environment variable is not defined")
    }

    const response = await fetch(`${authAppUrl}/api/auth/sign-out`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include"
    })
    if (!response.ok) {
      throw new Error(`Sign out failed: ${response.status} ${response.statusText}`)
    }

    return true
  } catch (error) {
    console.error("Error signing out user:", error)
    return false
  }
}
