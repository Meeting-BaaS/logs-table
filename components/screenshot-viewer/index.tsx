"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ScreenshotCarousel } from "@/components/screenshot-viewer/screenshot-carousel"
import { useScreenshotViewer } from "@/hooks/use-screenshot-viewer"

export function ScreenshotViewer() {
  const { isOpen, screenshots, closeViewer } = useScreenshotViewer()

  if (screenshots.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeViewer}>
      <DialogTitle className="sr-only">Screenshot Viewer</DialogTitle>
      <DialogContent
        className="!max-w-none h-svh w-svw border-none bg-background p-0 dark:bg-black"
        aria-describedby="screenshot-viewer"
      >
        <div className="h-full w-full">
          <ScreenshotCarousel screenshots={screenshots} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
