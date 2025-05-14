"use client"

import Datepicker from "react-tailwindcss-datepicker"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"

interface DateRangePickerProps {
  value: DateValueType
  onChange: (value: DateValueType) => void
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  return (
    <Datepicker
      value={value}
      onChange={onChange}
      showShortcuts={true}
      showFooter={true}
      useRange={true}
      asSingle={false}
      displayFormat="DD/MM/YYYY"
      placeholder="Select date range"
      inputClassName="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      toggleClassName="hidden"
      popoverDirection="down"
      containerClassName="relative w-full"
      primaryColor="blue"
    />
  )
} 