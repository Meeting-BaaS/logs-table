import { AI_CHAT_URL, getApiBaseUrl } from "@/lib/external-urls"
import { reportErrorServerSchema } from "@/lib/schemas/report-error"
import { generateUUID } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = getApiBaseUrl()

export async function POST(request: NextRequest) {
  const jwt = request.cookies.get("jwt")?.value

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  try {
    const { bot_uuid, note } = reportErrorServerSchema.parse(body)

    // 1. Create a chat with the error details
    const chatId = generateUUID()
    const messageId = generateUUID()

    const errorDetails = note ? ` Error details: ${note}.` : ""

    const chatResponse = await fetch(`${AI_CHAT_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.cookies.toString()
      },
      body: JSON.stringify({
        id: chatId,
        messages: [
          {
            id: messageId,
            role: "user",
            parts: [
              {
                type: "text",
                text: `I am facing an error with a bot and the bot id is ${bot_uuid}.${errorDetails} Can you please help me with it?`
              }
            ],
            createdAt: new Date()
          }
        ],
        selectedChatModel: "chat-model"
      })
    })

    if (!chatResponse.ok) {
      throw new Error(`Failed to create chat: ${chatResponse.status} ${chatResponse.statusText}`)
    }

    // 2. Report the error to the server
    const response = await fetch(`${apiServerBaseUrl}/bots/${bot_uuid}/user_reported_error`, {
      method: "POST",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bot_uuid, note, chat_id: chatId })
    })

    if (!response.ok) {
      // Delete the chat from the AI Chat app if the report error request fails
      await fetch(`${AI_CHAT_URL}/api/chat?id=${chatId}`, {
        method: "DELETE",
        headers: {
          Cookie: request.cookies.toString()
        }
      })
      throw new Error(`Failed to report error: ${response.status} ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to report error", error)
    return NextResponse.json({ error: "Failed to report error" }, { status: 500 })
  }
}
