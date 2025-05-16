"use client"

import { updateError } from "@/lib/api"
import { useSession } from "@/hooks/use-session"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { UserReportedError, UserReportedErrorMessage } from "@/components/logs-table/types"
import { newMessageSchema, type NewMessageFormData } from "@/lib/schemas/report-error"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { CircleCheck, SendHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface NewMessageProps {
  bot_uuid: string
  onMessageSent: (message: UserReportedErrorMessage) => void
  onMessageUpdate: (
    messageId: string,
    status: UserReportedErrorMessage["status"],
    errorStatus: UserReportedError["status"]
  ) => void
  errorStatus: UserReportedError["status"]
}

export function NewMessage({
  bot_uuid,
  onMessageSent,
  onMessageUpdate,
  errorStatus
}: NewMessageProps) {
  const session = useSession()

  const form = useForm<NewMessageFormData>({
    resolver: zodResolver(newMessageSchema),
    defaultValues: {
      note: ""
    }
  })

  const onSubmit = async (data: NewMessageFormData, status: UserReportedError["status"]) => {
    const messageId = crypto.randomUUID()

    // Create a pending message
    const pendingMessage: UserReportedErrorMessage = {
      id: messageId,
      author: session?.user.email || "",
      note: data.note,
      created_at: new Date().toISOString(),
      status: "pending",
      timezoneCorrection: false // created in user's timezone, no timezone correction needed
    }

    // Add the pending message to the list
    onMessageSent(pendingMessage)
    form.reset()

    try {
      await updateError(bot_uuid, data.note, status)
      onMessageUpdate(messageId, "success", status)
    } catch (error) {
      console.error("Error sending message", error)
      onMessageUpdate(messageId, "error", status)
    }
  }

  const handleMarkAsResolved = () => {
    onSubmit({ note: "User has marked this error as resolved" }, "closed")
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => onSubmit(data, errorStatus === "closed" ? "open" : errorStatus) // Revert to open if the error is closed
        )}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <div className="relative flex grow flex-col gap-2">
                <FormControl>
                  <Textarea
                    placeholder={
                      errorStatus === "closed"
                        ? "Add additional notes for Meeting BaaS developers..."
                        : "Add a note to reopen the error..."
                    }
                    className="w-full resize-none overflow-y-auto overflow-x-hidden whitespace-pre-wrap pr-10"
                    style={{ wordBreak: "break-word" }}
                    {...field}
                    maxLength={200}
                  />
                </FormControl>
                <FormDescription className="-mt-1 text-right text-xs">
                  {field.value?.length || 0}/200
                </FormDescription>
                <FormMessage />
                {errorStatus !== "closed" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="absolute top-0 right-0"
                        aria-label="Mark as resolved"
                        onClick={handleMarkAsResolved}
                      >
                        <CircleCheck className="stroke-primary" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">Mark as resolved</TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Button
                type="submit"
                size="icon"
                aria-label="Send Message"
                disabled={!field.value.trim()}
              >
                <SendHorizontal />
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
