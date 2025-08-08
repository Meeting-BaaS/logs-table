"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { CheckboxFilter } from "@/components/logs-table/checkbox-filter"
import { EmailFilter } from "@/components/logs-table/email-filter"
import {
  allPlatforms,
  allStatuses,
  allUserReportedErrorStatuses
} from "@/components/logs-table/column-helpers"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { filtersSchema, type FiltersFormData } from "@/lib/schemas/filters"
import { Filter, FunnelX } from "lucide-react"
import type { FilterState } from "@/components/logs-table/types"
import { useState } from "react"
import { isEqual } from "lodash"

const filtersFields = [
  {
    name: "platformFilters",
    label: "Platform",
    options: allPlatforms
  },
  {
    name: "statusFilters",
    label: "Status",
    options: allStatuses
  },
  {
    name: "userReportedErrorStatusFilters",
    label: "User Reported Error",
    options: allUserReportedErrorStatuses
  }
]

const clearFilters: FilterState = {
  platformFilters: [],
  statusFilters: [],
  userReportedErrorStatusFilters: [],
  userEmailFilter: ""
}

interface AdditionalFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  pageIndex: number
  onPageChange: (pageIndex: number) => void
  isMeetingBaasUser?: boolean
}

export function AdditionalFilters({
  filters,
  setFilters,
  pageIndex,
  onPageChange,
  isMeetingBaasUser = false
}: AdditionalFiltersProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      platformFilters: filters.platformFilters,
      statusFilters: filters.statusFilters,
      userReportedErrorStatusFilters: filters.userReportedErrorStatusFilters,
      userEmailFilter: filters.userEmailFilter
    }
  })

  const resetPageIndex = () => {
    // Reset the page index to 0 when the filters change
    if (pageIndex !== 0) {
      onPageChange(0)
    }
  }

  const onSubmit = (data: FiltersFormData) => {
    setOpen(false)
    if (isEqual(data, filters)) {
      return
    }
    resetPageIndex()
    setFilters({
      platformFilters: data.platformFilters ?? [],
      statusFilters: data.statusFilters ?? [],
      userReportedErrorStatusFilters: data.userReportedErrorStatusFilters ?? [],
      userEmailFilter: data.userEmailFilter ?? ""
    })
  }

  const handleClearAll = () => {
    setOpen(false)
    if (isEqual(clearFilters, filters)) {
      return
    }
    resetPageIndex()
    form.reset(clearFilters)
    setFilters(clearFilters)
  }

  const isFiltered = Object.entries(filters).some(([key, value]) => {
    // Skip email filter for non-Meeting BaaS users
    if (key === 'userEmailFilter' && !isMeetingBaasUser) {
      return false
    }
    if (Array.isArray(value)) {
      return value.length > 0
    }
    return value && value.length > 0
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full gap-2 md:w-auto" aria-pressed={isFiltered}>
          {isFiltered ? <FunnelX /> : <Filter />}
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xs" side="left">
        <SheetHeader className="gap-0.5">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Select one or more filters to narrow down the results</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4">
            {filtersFields.map((filter) => (
              <FormField
                key={filter.name}
                control={form.control}
                name={filter.name as keyof FiltersFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CheckboxFilter
                        options={filter.options}
                        label={filter.label}
                        selectedValues={Array.isArray(field.value) ? field.value : []}
                        onFilterChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {isMeetingBaasUser && (
              <FormField
                control={form.control}
                name="userEmailFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <EmailFilter
                        value={typeof field.value === 'string' ? field.value : ""}
                        onFilterChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="grow"
              >
                Clear All
              </Button>
              <Button type="submit" size="sm" className="grow">
                Apply Filters
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
