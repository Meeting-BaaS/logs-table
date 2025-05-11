"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { Table } from "@tanstack/react-table"
import { useEffect } from "react"

const STORAGE_KEY = "logs-table-column-visibility"

interface ColumnVisibilityDropdownProps<TData> {
  table: Table<TData>
}

export function ColumnVisibilityDropdown<TData>({ table }: ColumnVisibilityDropdownProps<TData>) {
  // Load initial visibility from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      table.setColumnVisibility(JSON.parse(stored))
    }
  }, [table])

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        table.setColumnVisibility(JSON.parse(e.newValue))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [table])

  // Function to handle column visibility changes
  const handleColumnVisibilityChange = (columnId: string, value: boolean) => {
    const newVisibility = {
      ...table.getState().columnVisibility,
      [columnId]: value
    }

    // Update local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))

    // Update table
    table.setColumnVisibility(newVisibility)
  }

  // Function to handle toggle all
  const handleToggleAll = (value: boolean) => {
    const newVisibility = table.getAllColumns().reduce(
      (acc, column) => {
        acc[column.id] = value
        return acc
      },
      {} as Record<string, boolean>
    )

    // Update local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVisibility))

    // Update table
    table.setColumnVisibility(newVisibility)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuCheckboxItem
          key="toggle-all"
          className="capitalize"
          checked={table.getAllColumns().every((column) => column.getIsVisible())}
          onCheckedChange={handleToggleAll}
        >
          Toggle All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => handleColumnVisibilityChange(column.id, !!value)}
              >
                {(column.columnDef.meta as { displayName: string })?.displayName || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
