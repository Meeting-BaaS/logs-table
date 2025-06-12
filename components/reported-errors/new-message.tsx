"use client"

import { updateError } from "@/lib/api"
import { useSession } from "@/hooks/use-session"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type {
  UserReportedError,
  UserReportedErrorMessage,
  UserReportedErrorStatus
} from "@/components/logs-table/types"
import { newMessageSchema, type NewMessageFormData } from "@/lib/schemas/report-error"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { CircleCheck, SendHorizontal } from "lucide-react"
import { Button } from "../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

interface NewMessageProps {
  bot_uuid: string
  onMessageSent: (message: UserReportedErrorMessage) => void
  onMessageUpdate: (
    messageId: string,
    status: UserReportedErrorMessage["status"],
    errorStatus: UserReportedError["status"]
  ) => void
  errorStatus: UserReportedError["status"]
  isMeetingBaasUser?: boolean | undefined
  accountEmail?: string
}

export function NewMessage({
  bot_uuid,
  onMessageSent,
  onMessageUpdate,
  errorStatus,
  isMeetingBaasUser = false,
  accountEmail
}: NewMessageProps) {
  const session = useSession()

  const form = useForm<NewMessageFormData>({
    resolver: zodResolver(newMessageSchema),
    defaultValues: {
      status: errorStatus,
      note: ""
    }
  })

  const onSubmit = async (data: NewMessageFormData) => {
    const messageId = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2)

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

    // If the user is not a Meeting BaaS user and the error was closed, reopen the error upon submitting a new message
    const status =
      !isMeetingBaasUser && errorStatus === "closed"
        ? "open"
        : (data.status as UserReportedErrorStatus)

    form.reset({
      status,
      note: ""
    })

    try {
      await updateError({
        bot_uuid,
        note: data.note,
        accountEmail,
        sendReplyEmail: isMeetingBaasUser,
        status
      })
      onMessageUpdate(messageId, "success", status)
    } catch (error) {
      console.error("Error sending message", error)
      onMessageUpdate(messageId, "error", status)
    }
  }

  const handleMarkAsResolved = () => {
    onSubmit({ note: "User has marked this error as resolved", status: "closed" })
  }

  // Set the placeholder text based on the user's role and the error status
  const placeholder = isMeetingBaasUser
    ? "Enter a message to respond to the user..."
    : errorStatus === "closed"
      ? "Add a note to reopen the error..."
      : "Add additional notes for Meeting BaaS developers..."

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {/* Only show the status field and warning message if the user is a Meeting BaaS user */}
        {isMeetingBaasUser && (
          <>
            <FormDescription className="text-center text-amber-500 text-xs">
              Meuh 🐇🐮🦙🐨👽 - No Bullshit Baas User says
            </FormDescription>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex gap-2 pr-12">
                  <FormLabel>Set status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="grow">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </>
        )}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="flex gap-2">
              <div className="relative flex grow flex-col gap-2">
                <FormControl>
                  <Textarea
                    placeholder={placeholder}
                    className="h-20 w-full resize-none pr-10 [word-break:break-word]"
                    {...field}
                    maxLength={isMeetingBaasUser ? 2000 : 200} // Increase the max length for Meeting BaaS users
                  />
                </FormControl>
                {isMeetingBaasUser ? (
                  <FormDescription className="text-xs">
                    As a Meeting BaaS developer, you can set the status and respond to the user.
                  </FormDescription>
                ) : (
                  <>
                    <FormDescription className="-mt-1 text-right text-xs">
                      {field.value?.length || 0}/200
                    </FormDescription>
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
                  </>
                )}
                <FormMessage />
              </div>
              <Button
                type="submit"
                size="icon"
                aria-label="Send Message"
                disabled={!isMeetingBaasUser && !field.value.trim()} // Disable the button if the user is not a Meeting BaaS user and the note is empty
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
