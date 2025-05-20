"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface CopyHoverCardProps {
  trigger: React.ReactNode
  title: string
  content: string
  className?: string
}

export function CopyHoverCard({ trigger, title, content, className }: CopyHoverCardProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Hover card copy error", err)
      toast.error("Failed to copy.")
    }
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent className={cn("w-80", className)}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="font-semibold text-sm capitalize">{title}</h4>
            <div className="max-h-[200px] overflow-y-auto pr-2">
              <p className="whitespace-pre-wrap break-words text-muted-foreground text-sm">
                {content}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mt-3 -mr-3 h-8 w-8 shrink-0"
            onClick={() => copyToClipboard(content)}
          >
            {isCopied ? <Check className="size-4 stroke-primary" /> : <Copy className="size-4" />}
            <span className="sr-only">Copy content</span>
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
