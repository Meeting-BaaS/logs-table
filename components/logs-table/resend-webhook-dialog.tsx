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
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { retryWebhook } from "@/lib/api"
import { webhookResendSchema, type WebhookResendFormData } from "@/lib/schemas/webhook-resend"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface ResendWebhookDialogProps {
  bot_uuid: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResendWebhookDialog({ bot_uuid, open, onOpenChange }: ResendWebhookDialogProps) {
  const [resendLoading, setResendLoading] = useState(false)
  const form = useForm<WebhookResendFormData>({
    resolver: zodResolver(webhookResendSchema),
    defaultValues: {
      webhookUrl: ""
    }
  })

  const handleSubmit = async (data: WebhookResendFormData) => {
    if (resendLoading) {
      return
    }
    try {
      setResendLoading(true)
      await retryWebhook(bot_uuid, data.webhookUrl)
      toast.success("Final webhook resent successfully.")
      onOpenChange(false)
      form.reset()
    } catch (error) {
      console.error("Failed to resend final webhook", error)
      toast.error("Failed to resend final webhook.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resend Final Webhook</DialogTitle>
          <DialogDescription>You can optionally provide a custom webhook path.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom webhook path:</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/webhook" {...field} maxLength={2048} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={resendLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={resendLoading}>
                {resendLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend Webhook"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
