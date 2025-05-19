import { useContext } from "react"
import { TableDialogsContext } from "@/contexts/table-dialogs-context"

export function useTableDialogs() {
  const context = useContext(TableDialogsContext)
  if (context === undefined) {
    throw new Error("useTableDialogs must be used within a TableDialogsProvider")
  }
  return context
}
