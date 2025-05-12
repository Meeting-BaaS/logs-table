import type { BotPaginated } from "@/components/logs-table/types"
import { getApiBaseUrl } from "@/lib/external-urls"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = getApiBaseUrl()

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const offset = searchParams.get("offset")
  const limit = searchParams.get("limit")
  const start_date = searchParams.get("start_date")
  const end_date = searchParams.get("end_date")
  const jwt = request.cookies.get("jwt")?.value

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!offset || !limit || !start_date || !end_date) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  const queryParams = new URLSearchParams({
    offset: offset,
    limit: limit,
    start_date: start_date,
    end_date: end_date
  })

  try {
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
