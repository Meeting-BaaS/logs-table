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

interface AdditionalFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export function AdditionalFilters({ filters, setFilters }: AdditionalFiltersProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      platformFilters: filters.platformFilters,
      statusFilters: filters.statusFilters,
      userReportedErrorStatusFilters: filters.userReportedErrorStatusFilters
    }
  })

  const onSubmit = (data: FiltersFormData) => {
    setOpen(false)
    setFilters({
      platformFilters: data.platformFilters ?? [],
      statusFilters: data.statusFilters ?? [],
      userReportedErrorStatusFilters: data.userReportedErrorStatusFilters ?? []
    })
  }

  const handleClearAll = () => {
    setOpen(false)
    form.reset({
      platformFilters: [],
      statusFilters: [],
      userReportedErrorStatusFilters: []
    })
    setFilters({
      platformFilters: [],
      statusFilters: [],
      userReportedErrorStatusFilters: []
    })
  }

  const isFiltered = Object.keys(filters).some(
    (key) => filters[key as keyof FilterState].length > 0
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
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
                        selectedValues={field.value ?? []}
                        onFilterChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
