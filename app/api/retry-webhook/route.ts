import { getApiBaseUrl } from "@/lib/external-urls"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = getApiBaseUrl()

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const bot_uuid = searchParams.get("bot_uuid")
  const jwt = request.cookies.get("jwt")?.value

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!bot_uuid) {
    return NextResponse.json({ error: "Missing bot_uuid" }, { status: 400 })
  }

  try {
    const response = await fetch(`${apiServerBaseUrl}/bots/retry_webhook?bot_uuid=${bot_uuid}`, {
      method: "POST",
      headers: {
        Cookie: `jwt=${jwt}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to resend webhook: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to resend webhook", error)
    return NextResponse.json({ error: "Failed to resend webhook" }, { status: 500 })
  }
}
