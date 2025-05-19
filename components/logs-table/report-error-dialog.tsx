"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
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
import { reportErrorSchema, type ReportErrorFormData } from "@/lib/schemas/report-error"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { reportError } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import type { FormattedBotData } from "@/components/logs-table/types"
interface ReportErrorDialogProps {
  row: FormattedBotData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportErrorDialog({ row, open, onOpenChange }: ReportErrorDialogProps) {
  const { uuid: bot_uuid } = row || {}
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()

  const form = useForm<ReportErrorFormData>({
    resolver: zodResolver(reportErrorSchema),
    defaultValues: {
      note: ""
    }
  })

  if (!bot_uuid) {
    return null
  }

  const onSubmit = async (data: ReportErrorFormData) => {
    try {
      setIsSubmitting(true)
      await reportError(bot_uuid, data.note)
      toast.success("Error reported successfully.")
      handleOpenChange(false, true)
    } catch {
      toast.error("Failed to report error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean, invalidateLogs?: boolean) => {
    if (!open) {
      form.reset()
      // Invalidate logs query so that logs are fetched again
      if (invalidateLogs) {
        queryClient.invalidateQueries({ queryKey: ["logs"] })
      }
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meeting BaaS says:</DialogTitle>
          <DialogDescription>
            Do you want to report an error for the bot{" "}
            <span className="font-semibold">{bot_uuid}</span>?
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Context</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter additional context about the error..."
                      className="resize-none"
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormDescription className="-mt-1 text-right text-xs">
                    {field.value?.length || 0}/200
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant="destructive" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Reporting...
                  </>
                ) : (
                  "Report"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
