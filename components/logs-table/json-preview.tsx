"use client"

import { CopyHoverCard } from "@/components/logs-table/copy-hover-card"

interface JsonPreviewProps {
  data: string | null
}

export function JsonPreview({ data }: JsonPreviewProps) {
  if (!data) {
    return <span className="text-muted-foreground text-xs">N/A</span>
  }

  let parsedData = null

  try {
    parsedData = JSON.parse(data)
  } catch (error) {
    console.error("JSON parse error", error)
    parsedData = data
  }

  // Get the first entry for preview
  const [firstKey, firstValue] = Object.entries(parsedData)[0] ?? []
  if (!firstKey) return null

  const valueStr = JSON.stringify(firstValue)
  const preview = `{ ${firstKey}: ${valueStr} }`
  const truncatedPreview = preview.length > 17 ? `${preview.substring(0, 14)}...` : preview

  return (
    <CopyHoverCard
      trigger={<span className="text-xs">{truncatedPreview}</span>}
      title="Complete JSON"
      content={JSON.stringify(parsedData, null, 2)}
    />
  )
}
