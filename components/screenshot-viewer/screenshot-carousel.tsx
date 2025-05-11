"use client"

import useEmblaCarousel from "embla-carousel-react"
import type { Screenshot } from "@/components/logs-table/types"
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from "@/components/screenshot-viewer/carousel-arrow-buttons"
import Image from "next/image"
import { useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"

interface ScreenshotCarouselProps {
  screenshots: Screenshot[]
}

export function ScreenshotCarousel({ screenshots }: ScreenshotCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true
  })
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})
  const [loadingImages, setLoadingImages] = useState<Record<number, boolean>>({})
  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } =
    usePrevNextButtons(emblaApi)

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }))
  }

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => ({ ...prev, [index]: false }))
  }

  return (
    <div className="relative h-full w-full">
      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full w-full">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="relative flex min-w-0 flex-[0_0_100%] items-center justify-center"
            >
              {imageErrors[index] ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="size-8" />
                  <p>Image not available</p>
                  <p className="text-muted-foreground text-sm">
                    The image may have expired or been removed
                  </p>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  {loadingImages[index] !== false && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                      <Loader2 className="size-8 animate-spin stroke-primary" />
                    </div>
                  )}
                  <Image
                    src={screenshot.url}
                    alt={`Screenshot ${index + 1}`}
                    className="h-full w-full object-contain p-12"
                    fill
                    sizes="100vw"
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
      <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
    </div>
  )
}
