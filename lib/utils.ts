import type { UserReportedError } from "@/components/logs-table/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a UUID, similar to the one used by the AI Chat repository.
 * @returns A UUID.
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getErrorStatusVariant(status: UserReportedError["status"]) {
  switch (status) {
    case "open":
      return "destructive"
    case "in_progress":
      return "warning"
    case "closed":
      return "default"
    default:
      return "outline"
  }
}

export function isMeetingBaasUser(email?: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "meetingbaas.com"
  if (!email) return false
  return email.endsWith(`@${domain}`)
}
