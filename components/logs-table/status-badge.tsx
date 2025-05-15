"use client"

import { Badge } from "@/components/ui/badge"
import type { StatusType } from "@/components/logs-table/types"
import { CopyHoverCard } from "@/components/logs-table/copy-hover-card"

interface StatusBadgeProps {
  text: string
  type: StatusType
  details?: string | null
}

export function StatusBadge({ text, type, details }: StatusBadgeProps) {
  const getStatusVariant = (type: StatusBadgeProps["type"]) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "warning"
      case "success":
        return "default"
      default:
        return "outline"
    }
  }

  const badge = (
    <Badge variant={getStatusVariant(type)} className="text-xs">
      {text}
    </Badge>
  )

  if (!details) {
    return badge
  }

  return <CopyHoverCard trigger={badge} title={`${type} Details`} content={details} />
}
