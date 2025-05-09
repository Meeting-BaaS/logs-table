import type { Column } from "@tanstack/react-table"
import type { FormattedBotData } from "@/components/logs-table/types"
import { Button } from "@/components/ui/button"
import { SortIcon } from "@/components/ui/sort-icon"

const sortButtonClasses = "p-0 hover:bg-transparent dark:hover:bg-transparent"

export const SortableHeader = ({
  column,
  title,
  isNumber
}: {
  column: Column<FormattedBotData>
  title: string
  isNumber?: boolean
}) => {
  return (
    <Button
      variant="ghost"
      className={sortButtonClasses}
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      <SortIcon isSorted={column.getIsSorted()} isNumber={isNumber} />
    </Button>
  )
}
