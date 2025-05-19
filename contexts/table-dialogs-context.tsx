"use client"

import { createContext, useCallback, useState } from "react"
import type { FormattedBotData } from "@/components/logs-table/types"
import { ResendWebhookDialog } from "@/components/logs-table/resend-webhook-dialog"
import { ReportErrorDialog } from "@/components/logs-table/report-error-dialog"
import ReportedErrorDialog from "@/components/reported-errors"

interface TableDialogsContextType {
  resendWebhookDialogState: DialogState
  reportErrorDialogState: DialogState
  reportedErrorDialogState: DialogState
  showResendWebhookDialog: (row: FormattedBotData) => void
  handleResendWebhookDialogChange: (open: boolean) => void
  showReportErrorDialog: (row: FormattedBotData) => void
  handleReportErrorDialogChange: (open: boolean) => void
  showReportedErrorDialog: (row: FormattedBotData, isMeetingBaasUser?: boolean) => void
  handleReportedErrorDialogChange: (open: boolean) => void
}

type DialogState = {
  open: boolean
  row: FormattedBotData | null
  isMeetingBaasUser?: boolean
}

const initialDialogState: DialogState = {
  open: false,
  row: null,
  isMeetingBaasUser: undefined
}

export const TableDialogsContext = createContext<TableDialogsContextType | undefined>(undefined)

export function TableDialogsProvider({ children }: { children: React.ReactNode }) {
  const [resendWebhookDialogState, setResendWebhookDialogState] =
    useState<DialogState>(initialDialogState)
  const [reportErrorDialogState, setReportErrorDialogState] =
    useState<DialogState>(initialDialogState)
  const [reportedErrorDialogState, setReportedErrorDialogState] =
    useState<DialogState>(initialDialogState)

  const showResendWebhookDialog = useCallback((row: FormattedBotData) => {
    setResendWebhookDialogState({
      open: true,
      row
    })
  }, [])

  const handleResendWebhookDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setResendWebhookDialogState(initialDialogState)
      } else {
        setResendWebhookDialogState({
          ...resendWebhookDialogState,
          open
        })
      }
    },
    [resendWebhookDialogState]
  )

  const showReportErrorDialog = useCallback((row: FormattedBotData) => {
    setReportErrorDialogState({
      open: true,
      row
    })
  }, [])

  const handleReportErrorDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setReportErrorDialogState(initialDialogState)
      } else {
        setReportErrorDialogState({
          ...reportErrorDialogState,
          open
        })
      }
    },
    [reportErrorDialogState]
  )

  const showReportedErrorDialog = useCallback(
    (row: FormattedBotData, isMeetingBaasUser?: boolean) => {
      setReportedErrorDialogState({
        open: true,
        row,
        isMeetingBaasUser
      })
    },
    []
  )

  const handleReportedErrorDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setReportedErrorDialogState(initialDialogState)
      } else {
        setReportedErrorDialogState({
          ...reportedErrorDialogState,
          open
        })
      }
    },
    [reportedErrorDialogState]
  )

  return (
    <TableDialogsContext.Provider
      value={{
        resendWebhookDialogState,
        reportErrorDialogState,
        reportedErrorDialogState,
        showResendWebhookDialog,
        handleResendWebhookDialogChange,
        showReportErrorDialog,
        handleReportErrorDialogChange,
        showReportedErrorDialog,
        handleReportedErrorDialogChange
      }}
    >
      {children}
      <ResendWebhookDialog
        open={resendWebhookDialogState.open}
        onOpenChange={handleResendWebhookDialogChange}
        row={resendWebhookDialogState.row}
      />

      <ReportErrorDialog
        row={reportErrorDialogState.row}
        open={reportErrorDialogState.open}
        onOpenChange={handleReportErrorDialogChange}
      />

      <ReportedErrorDialog
        row={reportedErrorDialogState.row}
        open={reportedErrorDialogState.open}
        onOpenChange={handleReportedErrorDialogChange}
        isMeetingBaasUser={reportedErrorDialogState.isMeetingBaasUser}
      />
    </TableDialogsContext.Provider>
  )
}
