"use client"

import Datepicker, { type DateValueType } from "react-tailwindcss-datepicker"
import dayjs from "dayjs"

interface DateRangeFilterProps {
  value: DateValueType
  onChange: (value: DateValueType) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const handleDateChange = (newValue: DateValueType) => {
    if (newValue?.startDate && newValue?.endDate) {
      onChange({
        startDate: dayjs(newValue.startDate).startOf("day").toDate(),
        endDate: dayjs(newValue.endDate).endOf("day").toDate()
      })
    } else {
      onChange(newValue)
    }
  }

  return (
    <div className="relative my-4">
      <Datepicker
        value={value}
        separator=" - "
        onChange={handleDateChange}
        showShortcuts={true}
        useRange={true}
        asSingle={false}
        readOnly={true}
        toggleClassName="hidden" // Date shouldn't be cleared out
        inputName="date-range-filter"
        inputClassName="relative border border-input text-foreground h-9 rounded-md py2.5 pl-3 pr-14 w-full text-base shadow-xs transition-[color,box-shadow] outline-none cursor-pointer md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground"
      />
    </div>
  )
}
