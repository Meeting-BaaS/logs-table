"use client"

import { CheckboxFilter } from "@/components/logs-table/checkbox-filter"
import { allPlatforms, allStatuses } from "@/components/logs-table/column-helpers"
import type { Table } from "@tanstack/react-table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"

interface AdditionalFiltersProps<TData> {
  table: Table<TData>
}

export function AdditionalFilters<TData>({ table }: AdditionalFiltersProps<TData>) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="filters">
        <AccordionTrigger className="py-0.5 pb-2 text-primary">Additional filters</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 pt-2">
          <CheckboxFilter
            table={table}
            columnId="platform"
            options={allPlatforms}
            label="Platform"
          />
          <CheckboxFilter table={table} columnId="status" options={allStatuses} label="Status" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
