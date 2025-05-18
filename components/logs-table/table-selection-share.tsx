"use client"

import { Button } from "@/components/ui/button"
import { Check, Share2 } from "lucide-react"
import { toast } from "sonner"
import type { RowSelectionState } from "@tanstack/react-table"
import { useSearchParams } from "next/navigation"
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { useState } from "react"

interface TableSelectionShareProps {
  rowSelection: RowSelectionState
}

const MAX_SHARE_UUIDS = 30

export function TableSelectionShare({ rowSelection }: TableSelectionShareProps) {
  const selectedUuids = Object.keys(rowSelection).filter((key) => rowSelection[key])
  const searchParams = useSearchParams()
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    if (selectedUuids.length === 0) {
      toast.error("Please select at least one row to share.")
      return
    }

    // With a 2048 character limit on the URL, we can add roughly 45 bot UUIDs
    // (accounting for the origin URL and other filter params)
    // Limit has been set to 30 to be safe
    if (selectedUuids.length > MAX_SHARE_UUIDS) {
      toast.error(`You can only share up to ${MAX_SHARE_UUIDS} logs at a time.`)
      return
    }

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("bot_uuid", selectedUuids.join(","))
    const shareUrl = `${window.location.origin}${window.location.pathname}?${newSearchParams.toString()}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 2000)
      // Clear the timeout when the component unmounts
      return () => clearTimeout(timer)
    } catch (err) {
      console.error("Failed to copy selected logs", err)
      toast.error("Failed to copy selected logs.")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={selectedUuids.length > 0 ? "default" : "outline"}
          size="icon"
          aria-label={isCopied ? "Copied" : "Share selected logs"}
          onClick={handleShare}
        >
          {isCopied ? <Check /> : <Share2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {selectedUuids.length > 0
            ? `Copy selected ${selectedUuids.length > 1 ? "logs" : "log"}`
            : "Select a row to share"}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
