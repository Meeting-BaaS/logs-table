"use client"

import { Button } from "@/components/ui/button"
import { Check, Share2 } from "lucide-react"
import { toast } from "sonner"
import type { Table } from "@tanstack/react-table"
import type { FormattedBotData } from "@/components/logs-table/types"
import { useSearchParams } from "next/navigation"
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip"
import { useState } from "react"

interface TableSelectionShareProps<TData> {
  table: Table<TData>
}

export function TableSelectionShare<TData>({ table }: TableSelectionShareProps<TData>) {
  const selectedRows = table.getSelectedRowModel().rows
  const searchParams = useSearchParams()
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    if (selectedRows.length === 0) {
      toast.error("Please select at least one row to share")
      return
    }

    // With a 2048 character limit on the URL, we can add roughly 45 bot UUIDs
    // (accounting for the origin URL and other filter params)
    // Limit has been set to 30 to be safe
    if (selectedRows.length > 30) {
      toast.error("You can only share up to 30 logs at a time")
      return
    }

    const selectedUuids = selectedRows.map((row) => (row.original as FormattedBotData).uuid)

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("bot_uuid", selectedUuids.join(","))
    const shareUrl = `${window.location.origin}${window.location.pathname}?${newSearchParams.toString()}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy selected logs", err)
      toast.error("Failed to copy selected logs")
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={isCopied ? "Copied" : "Share selected logs"}
          onClick={handleShare}
        >
          {isCopied ? <Check className="text-primary" /> : <Share2 />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {selectedRows.length > 0
            ? `Copy selected ${selectedRows.length > 1 ? "logs" : "log"}`
            : "Select a row to share"}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
