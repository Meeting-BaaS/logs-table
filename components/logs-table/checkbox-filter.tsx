"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { Table } from "@tanstack/react-table"

interface CheckboxFilterProps<TData, TValue> {
  table: Table<TData>
  columnId: string
  options: readonly TValue[]
  label: string
}

export function CheckboxFilter<TData, TValue extends string>({
  table,
  columnId,
  options,
  label
}: CheckboxFilterProps<TData, TValue>) {
  const filter = (table.getColumn(columnId)?.getFilterValue() as TValue[]) || []

  const handleAllChange = (checked: boolean) => {
    table.getColumn(columnId)?.setFilterValue(checked ? options : [])
  }

  const handleOptionChange = (option: TValue, checked: boolean) => {
    const newFilter = checked ? [...filter, option] : filter.filter((o) => o !== option)
    table.getColumn(columnId)?.setFilterValue(newFilter)
  }

  return (
    <>
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="flex flex-wrap gap-10">
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`all-${columnId}`}
            checked={filter.length === options.length}
            onCheckedChange={handleAllChange}
          />
          <Label htmlFor={`all-${columnId}`} className="font-medium text-sm">
            All
          </Label>
        </div>
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={option}
              checked={filter.includes(option)}
              onCheckedChange={(checked) => handleOptionChange(option, checked as boolean)}
            />
            <Label htmlFor={option} className="font-medium text-sm capitalize">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </>
  )
}
