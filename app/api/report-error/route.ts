import { AI_CHAT_URL } from "@/lib/external-urls"
import { reportErrorServerSchema } from "@/lib/schemas/report-error"
import { generateUUID } from "@/lib/utils"
import { type NextRequest, NextResponse } from "next/server"

const apiServerBaseUrl = process.env.API_SERVER_BASEURL
if (!apiServerBaseUrl) {
  throw new Error(
    "API_SERVER_BASEURL is not defined in the environment variables. Please set it in your .env file."
  )
}

export async function POST(request: NextRequest) {
  const cookies = request.cookies
  const jwt = cookies.get("jwt")?.value

  if (!jwt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  try {
    const { bot_uuid, note } = reportErrorServerSchema.parse(body)

    // 1. Create a chat with the error details
    const chatId = generateUUID()
    const messageId = generateUUID()

    const errorDetails = note ? ` Additional context: ${note}` : ""

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
                text: `I am facing an error with a bot and the bot id is ${bot_uuid}.Can you please help me with it?${errorDetails}`
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
    // This is a hardcoded note. The client side will check if the note starts with this string
    // and if it does, it will replace it with an empty string
    // If updating this note, make sure to update the hardcoded note check in the client side as well
    const message = `User reported an error.${errorDetails}`
    const response = await fetch(`${apiServerBaseUrl}/bots/${bot_uuid}/user_reported_error`, {
      method: "POST",
      headers: {
        Cookie: `jwt=${jwt}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        bot_uuid,
        note: message,
        chat_id: chatId,
        status: "open"
      })
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

    // 3. Send an email to the user
    const emailResponse = await fetch(`${process.env.EMAIL_API_SERVER_BASEURL}/error-report/new`, {
      method: "POST",
      body: JSON.stringify({
        botUuid: bot_uuid,
        chatId,
        additionalContext: note
      }),
      headers: {
        "Content-Type": "application/json",
        Cookie: request.cookies.toString()
      }
    })

    if (!emailResponse.ok) {
      // We don't want to fail the report error request if the email fails to send
      console.error(`Failed to send email: ${emailResponse.status} ${emailResponse.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to report error", error)
    return NextResponse.json({ error: "Failed to report error" }, { status: 500 })
  }
}
