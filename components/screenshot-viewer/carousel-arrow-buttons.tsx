import { type ComponentPropsWithRef, useCallback, useEffect, useState } from "react"
import type { EmblaCarouselType } from "embla-carousel"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

type UsePrevNextButtonsProps = {
  prevBtnDisabled: boolean
  nextBtnDisabled: boolean
  onPrevButtonClick: () => void
  onNextButtonClick: () => void
}

export const usePrevNextButtons = (
  carousel: EmblaCarouselType | undefined
): UsePrevNextButtonsProps => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!carousel) return
    carousel.scrollPrev()
  }, [carousel])

  const onNextButtonClick = useCallback(() => {
    if (!carousel) return
    carousel.scrollNext()
  }, [carousel])

  const onSelect = useCallback((carousel: EmblaCarouselType) => {
    setPrevBtnDisabled(!carousel.canScrollPrev())
    setNextBtnDisabled(!carousel.canScrollNext())
  }, [])

  useEffect(() => {
    if (!carousel) return

    onSelect(carousel)
    carousel.on("reInit", onSelect).on("select", onSelect)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && !prevBtnDisabled) {
        onPrevButtonClick()
      } else if (event.key === "ArrowRight" && !nextBtnDisabled) {
        onNextButtonClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      carousel.off("reInit", onSelect).off("select", onSelect)
    }
  }, [carousel, onSelect, onPrevButtonClick, onNextButtonClick, prevBtnDisabled, nextBtnDisabled])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type ButtonProps = ComponentPropsWithRef<"button">

export const PrevButton: React.FC<ButtonProps> = (props) => {
  const { children, disabled, ...restProps } = props

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 left-4",
        disabled && "cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
      {...restProps}
    >
      <ChevronLeft />
    </Button>
  )
}

export const NextButton: React.FC<ButtonProps> = (props) => {
  const { children, disabled, ...restProps } = props

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "-translate-y-1/2 absolute top-1/2 right-4",
        disabled && "cursor-not-allowed opacity-50"
      )}
      disabled={disabled}
      {...restProps}
    >
      <ChevronRight />
    </Button>
  )
}
