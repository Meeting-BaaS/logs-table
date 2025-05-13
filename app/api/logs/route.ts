import type { BotPaginated } from "@/components/logs-table/types"
import { getApiBaseUrl } from "@/lib/external-urls"
import { botQueryParamsSchema } from "@/lib/schemas/bot-search"
import { botSearchServerSchema } from "@/lib/schemas/bot-search"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = getApiBaseUrl()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const offset = Number(searchParams.get("offset"))
  const limit = Number(searchParams.get("limit"))
  const start_date = searchParams.get("start_date")
  const end_date = searchParams.get("end_date")
  const bot_uuid = searchParams.get("bot_uuid")
  const jwt = request.cookies.get("jwt")?.value

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const requestObject = {
      offset,
      limit,
      start_date,
      end_date,
      bot_uuid
    }

    // Validate the request object based on whether we are searching by bot UUID or not
    const validatedRequestObject = bot_uuid
      ? botSearchServerSchema.parse(requestObject)
      : botQueryParamsSchema.parse(requestObject)

    const queryParams = new URLSearchParams({
      ...validatedRequestObject,
      offset: validatedRequestObject.offset.toString(),
      limit: validatedRequestObject.limit.toString()
    })

    const response = await fetch(`${apiServerBaseUrl}/bots/all?${queryParams.toString()}`, {
      headers: {
        Cookie: `jwt=${jwt}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch logs: ${response.status} ${response.statusText}`)
    }

    const data: BotPaginated = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch logs", error)
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
  }
}
