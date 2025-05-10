"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import type { Table } from "@tanstack/react-table"

interface DataTableFilterProps<TData> {
  table: Table<TData>
  globalFilter: string
  onGlobalFilterChange: (value: string) => void
}

export function DataTableFilter<TData>({
  table,
  globalFilter,
  onGlobalFilterChange
}: DataTableFilterProps<TData>) {
  return (
    <div className="relative max-w-sm">
      <Input
        placeholder="Search"
        value={globalFilter ?? ""}
        onChange={(event) => onGlobalFilterChange(event.target.value)}
        className="pr-8"
        aria-label="search all columns"
        name="global-search"
      />
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-2 py-0.5"
        onClick={() => onGlobalFilterChange("")}
        disabled={!globalFilter}
      >
        <X className="size-5" />
        <span className="sr-only">Clear search</span>
      </Button>
    </div>
  )
}
