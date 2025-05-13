"use client"

import { CopyHoverCard } from "@/components/logs-table/copy-hover-card"

interface JsonPreviewProps {
  data: Record<string, unknown> | null
}

export function JsonPreview({ data }: JsonPreviewProps) {
  if (!data || Object.keys(data).length === 0) {
    return <span className="text-muted-foreground text-xs">N/A</span>
  }

  // Get the first entry for preview
  const [firstKey, firstValue] = Object.entries(data)[0] ?? []
  if (!firstKey) return null

  const valueStr = JSON.stringify(firstValue)
  const preview = `{ ${firstKey}: ${valueStr} }`
  const truncatedPreview = preview.length > 17 ? `${preview.substring(0, 14)}...` : preview

  return (
    <CopyHoverCard
      trigger={<span className="text-xs">{truncatedPreview}</span>}
      title="Complete JSON"
      content={JSON.stringify(data, null, 2)}
    />
  )
}
