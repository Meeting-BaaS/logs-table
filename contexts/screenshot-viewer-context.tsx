"use client"

import { createContext, useCallback, useState } from "react"
import type { Screenshot } from "@/components/logs-table/types"

interface ScreenshotViewerContextType {
  isOpen: boolean
  screenshots: Screenshot[]
  openViewer: (screenshots: Screenshot[]) => void
  closeViewer: () => void
}

export const ScreenshotViewerContext = createContext<ScreenshotViewerContextType | undefined>(
  undefined
)

export function ScreenshotViewerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])

  const openViewer = useCallback((newScreenshots: Screenshot[]) => {
    setScreenshots(newScreenshots)
    setIsOpen(true)
  }, [])

  const closeViewer = useCallback(() => {
    setIsOpen(false)
    setScreenshots([])
  }, [])

  return (
    <ScreenshotViewerContext.Provider value={{ isOpen, screenshots, openViewer, closeViewer }}>
      {children}
    </ScreenshotViewerContext.Provider>
  )
}
