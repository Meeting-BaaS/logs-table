"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { UserReportedError, UserReportedErrorMessage } from "@/components/logs-table/types"
import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { NewMessage } from "@/components/reported-errors/new-message"
import { updateError } from "@/lib/api"
import { ViewMessages } from "@/components/reported-errors/view-messages"
import { useQueryClient } from "@tanstack/react-query"
import type { FormattedBotData } from "@/components/logs-table/types"
import { getErrorStatusVariant } from "@/lib/utils"

interface ReportedErrorDialogProps {
  row: FormattedBotData | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isMeetingBaasUser: boolean | undefined
}

export default function ReportedErrorDialog({
  row,
  open,
  onOpenChange,
  isMeetingBaasUser
}: ReportedErrorDialogProps) {
  const { user_reported_error: error, uuid: bot_uuid } = row || {}

  const queryClient = useQueryClient()

  const transformMessages = useCallback((messages: UserReportedErrorMessage[] | undefined) => {
    if (!messages || messages.length === 0) return []
    return (
      messages.map((message) => ({
        ...message,
        id:
          message.id ||
          (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2)),
        status: message.status || "success",
        timezoneCorrection: message.timezoneCorrection || true
      })) || []
    )
  }, [])

  const [messages, setMessages] = useState<UserReportedErrorMessage[]>(() =>
    transformMessages(error?.messages)
  )

  const [errorStatus, setErrorStatus] = useState<UserReportedError["status"]>(
    error?.status || "open"
  )

  useEffect(() => {
    setMessages(transformMessages(error?.messages))
    setErrorStatus(error?.status || "open")
  }, [error, transformMessages])

  if (!bot_uuid || !error) {
    return null
  }

  const handleMessageSent = (newMessage: UserReportedErrorMessage) => {
    setMessages((prev) => [...prev, newMessage])
  }

  const handleMessageUpdate = (
    messageId: string,
    status: UserReportedErrorMessage["status"],
    errorStatus: UserReportedError["status"]
  ) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, status } : msg)))
    setErrorStatus(errorStatus)
  }

  const handleRetry = async (message: UserReportedErrorMessage) => {
    if (!message.id) return

    try {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === message.id ? { ...msg, status: "pending" } : msg))
      )

      await updateError({
        bot_uuid,
        note: message.note,
        accountEmail: row?.account_email,
        sendReplyEmail: isMeetingBaasUser
      })
      handleMessageUpdate(message.id, "success", errorStatus)
    } catch (error) {
      console.error("Failed to retry message", error)
      handleMessageUpdate(message.id, "error", errorStatus)
    }
  }

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Invalidate logs query when dialog closes, so that logs are fetched again
      queryClient.invalidateQueries({ queryKey: ["logs"] })
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="max-h-[100svh] max-w-2xl overflow-y-auto sm:max-h-[100svh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Reported Error
            <Badge variant={getErrorStatusVariant(errorStatus)} className="capitalize">
              {errorStatus.replace("_", " ")}
            </Badge>
          </DialogTitle>
          <DialogDescription>Bot ID: {bot_uuid}</DialogDescription>
        </DialogHeader>
        <ViewMessages messages={messages} retry={handleRetry} />
        <NewMessage
          bot_uuid={bot_uuid}
          onMessageSent={handleMessageSent}
          onMessageUpdate={handleMessageUpdate}
          errorStatus={errorStatus}
          isMeetingBaasUser={isMeetingBaasUser}
          accountEmail={row?.account_email}
        />
      </DialogContent>
    </Dialog>
  )
}
