"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy, Share2, X } from "lucide-react"
import { toast } from "sonner"
import type { RowSelectionState } from "@tanstack/react-table"
import { useSearchParams } from "next/navigation"
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { useState } from "react"

interface TableSelectionShareProps {
  rowSelection: RowSelectionState // Record<string, boolean> where keys are row indices
}

const MAX_SHARE_UUIDS = 30

export function TableSelectionShare({ rowSelection }: TableSelectionShareProps) {
  const selectedUuids = Object.keys(rowSelection).filter((key) => rowSelection[key])
  const searchParams = useSearchParams()
  const [isCopied, setIsCopied] = useState(false)
  const [isCopiedBotIds, setIsCopiedBotIds] = useState(false)

  const handleCopy = async (text: string, setCopied: (isCopied: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy", text, err)
      toast.error("Failed to copy.")
    }
  }

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

    handleCopy(shareUrl, setIsCopied)
  }

  const handleCopyBotIds = async () => {
    // Button is displayed only if there are selected rows
    if (selectedUuids.length === 0) {
      return
    }

    handleCopy(selectedUuids.join(","), setIsCopiedBotIds)
  }

  return (
    <>
      {selectedUuids.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label={isCopiedBotIds ? "Copied" : "Copy selected Bot IDs"}
              onClick={handleCopyBotIds}
            >
              {isCopiedBotIds ? <Check className="stroke-primary" /> : <Copy />}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>{`Copy selected Bot ${selectedUuids.length > 1 ? "UUIDs" : "UUID"}`}</p>
          </TooltipContent>
        </Tooltip>
      )}
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
        <TooltipContent className="max-w-xs">
          <p>
            {selectedUuids.length > 0
              ? `Copy a URL with the selected ${selectedUuids.length > 1 ? "logs" : "log"}`
              : "Select rows by clicking anywhere on them or using the checkboxes to share multiple bots at once."}
          </p>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
