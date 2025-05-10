import { ScreenshotViewerContext } from "@/contexts/screenshot-viewer-context"
import { useContext } from "react"

export function useScreenshotViewer() {
  const context = useContext(ScreenshotViewerContext)
  if (context === undefined) {
    throw new Error("useScreenshotViewer must be used within a ScreenshotViewerProvider")
  }
  return context
}
