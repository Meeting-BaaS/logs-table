"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface DataTableFilterProps {
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function DataTableFilter({ globalFilter, onGlobalFilterChange }: DataTableFilterProps) {
  return (
    <div className="relative w-full">
      <Input
        placeholder="Search within this page"
        value={globalFilter ?? ""}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        className="pr-8"
        aria-label="search all columns"
        name="global-search"
      />
      {globalFilter && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 py-0.5"
          onClick={() => onGlobalFilterChange("")}
          aria-label="clear search"
        >
          <X />
        </Button>
      )}
    </div>
  )
}
