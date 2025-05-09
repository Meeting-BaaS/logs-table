export const ERROR_TYPES = {
  // Meeting-specific errors
  MEETING_ERRORS: {
    CannotJoinMeeting: "Cannot Join Meeting",
    "cannot join meeting": "Cannot Join Meeting",
    TimeoutWaitingToStart: "Meeting Start Timeout",
    BotNotAccepted: "Bot Not Accepted",
    InvalidMeetingUrl: "Invalid Meeting URL",
    InternalError: "Internal Error",
    AlreadyStarted: "Meeting Already Started"
  },
  // Webhook errors
  WEBHOOK_ERRORS: {
    "error sending webhook": "Webhook Error",
    "webhook status: error": "Webhook Error",
    "builder error": "Webhook Config Error",
    "error sending request": "Webhook Connection Error"
  },
  // HTTP status codes
  HTTP_STATUS: {
    "400": "Bad Request",
    "401": "Unauthorized",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "408": "Request Timeout",
    "429": "Too Many Requests",
    "500": "Internal Server Error",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout"
  }
} as const

export type ErrorType = "error" | "warning"

export interface ErrorInfo {
  text: string
  type: ErrorType
}

export function getReadableError(error: string): ErrorInfo {
  // Check for internal errors first (highest severity)
  if (error.includes("InternalError")) {
    return {
      text: ERROR_TYPES.MEETING_ERRORS.InternalError,
      type: "error"
    }
  }
  // Check for webhook errors (warning level)
  for (const [key, value] of Object.entries(ERROR_TYPES.WEBHOOK_ERRORS)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return { text: value, type: "warning" }
    }
  }

  // Check for HTTP status codes
  const statusMatch = error.match(/Status: (\d{3})/)
  if (statusMatch) {
    const statusCode = statusMatch[1]
    const statusMessage =
      ERROR_TYPES.HTTP_STATUS[statusCode as keyof typeof ERROR_TYPES.HTTP_STATUS]
    if (statusMessage) {
      // 500+ errors are server errors (high severity)
      if (Number.parseInt(statusCode) >= 500) {
        return {
          text: `HTTP ${statusCode}: ${statusMessage}`,
          type: "error"
        }
      }
      // 400-level errors are client errors (warning level)
      return {
        text: `HTTP ${statusCode}: ${statusMessage}`,
        type: "warning"
      }
    }
  }

  // Check for other meeting errors (high severity)
  for (const [key, value] of Object.entries(ERROR_TYPES.MEETING_ERRORS)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return { text: value, type: "error" }
    }
  }

  // If no specific error type found, treat as warning by default
  return {
    text: error,
    type: "warning"
  }
}
