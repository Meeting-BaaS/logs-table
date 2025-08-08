"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface EmailFilterProps {
  value?: string
  onFilterChange: (value: string) => void
  placeholder?: string
}

export function EmailFilter({ value = "", onFilterChange, placeholder = "Enter email address..." }: EmailFilterProps) {
  const [inputValue, setInputValue] = useState(value)

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onFilterChange(inputValue.trim())
    }
  }

  const handleClear = () => {
    setInputValue("")
    onFilterChange("")
  }

  const handleApply = () => {
    onFilterChange(inputValue.trim())
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">User Email</Label>
      <div className="relative">
        <Input
          type="email"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="pr-8"
          aria-label="filter by user email"
        />
        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-full px-2"
            onClick={handleClear}
            aria-label="clear email filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {inputValue !== value && (
        <Button
          size="sm"
          onClick={handleApply}
          className="w-full"
        >
          Apply Filter
        </Button>
      )}
    </div>
  )
} 