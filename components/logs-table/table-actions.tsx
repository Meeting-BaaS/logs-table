"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { RotateCcw, ExternalLink, AlertCircle } from "lucide-react"
import type { FormattedBotData } from "@/components/logs-table/types"

interface TableActionsProps {
  row: FormattedBotData
}

export function TableActions({ row }: TableActionsProps) {
  const renderButton = (icon: React.ReactNode, tooltip: string, onClick: () => void) => {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="flex w-full justify-center gap-2">
      {renderButton(<RotateCcw className="h-4 w-4" />, "Resend Final Webhook", () =>
        console.log("Resend bot")
      )}
      {renderButton(<ExternalLink className="h-4 w-4" />, "View recording", () =>
        console.log("View recording")
      )}
      {renderButton(<AlertCircle className="h-4 w-4" />, "Report error", () =>
        console.log("Report error")
      )}
    </div>
  )
}
