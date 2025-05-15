"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
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

interface ReportErrorDialogProps {
  bot_uuid: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportErrorDialog({ bot_uuid, open, onOpenChange }: ReportErrorDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReportErrorFormData>({
    resolver: zodResolver(reportErrorSchema),
    defaultValues: {
      note: ""
    }
  })

  const onSubmit = async (data: ReportErrorFormData) => {
    try {
      setIsSubmitting(true)
      await reportError(bot_uuid, data.note)
      toast.success("Error reported successfully")
      handleOpenChange(false)
    } catch {
      toast.error("Failed to report error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Error</DialogTitle>
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
                    {field.value?.length}/200
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
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
