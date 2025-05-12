import type { Screenshot } from "@/components/logs-table/types"
import { getAuthSession } from "@/lib/auth/session"
import { getApiBaseUrl } from "@/lib/external-urls"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = getApiBaseUrl()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bot_uuid = searchParams.get("bot_uuid")
  const session = await getAuthSession(request.cookies.toString())

  if (!session || !session.user || !session.user.botsApiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const bots_api_key = session.user.botsApiKey

  if (!bot_uuid) {
    return NextResponse.json({ error: "Missing bot_uuid" }, { status: 400 })
  }

  try {
    const response = await fetch(`${apiServerBaseUrl}/bots/${bot_uuid}/screenshots`, {
      headers: {
        "x-meeting-baas-api-key": bots_api_key
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch screenshots: ${response.status} ${response.statusText}`)
    }

    const data: Screenshot[] = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch screenshots", error)
    return NextResponse.json({ error: "Failed to fetch screenshots" }, { status: 500 })
  }
}
