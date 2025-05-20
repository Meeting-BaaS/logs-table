import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useEffect } from "react"

export const PAGE_SIZE_STORAGE_KEY = "logs-table-page-size"

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
}

export const pageSizeOptions = [
  {
    label: "20 results per page",
    value: 20
  },
  {
    label: "50 results per page",
    value: 50
  },
  {
    label: "100 results per page",
    value: 100
  }
]

export function PageSizeSelector({ value, onChange }: PageSizeSelectorProps) {
  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PAGE_SIZE_STORAGE_KEY && e.newValue) {
        const pageSize = Number(e.newValue)
        if (pageSizeOptions.some((option) => option.value === pageSize)) {
          onChange(pageSize)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [onChange])

  // Function to handle page size changes
  const handlePageSizeChange = (newValue: string) => {
    const pageSize = Number(newValue)
    // Update local storage
    localStorage.setItem(PAGE_SIZE_STORAGE_KEY, pageSize.toString())
    // Update component state
    onChange(pageSize)
  }

  return (
    <Select value={value.toString()} onValueChange={handlePageSizeChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Page size" />
      </SelectTrigger>
      <SelectContent>
        {pageSizeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
