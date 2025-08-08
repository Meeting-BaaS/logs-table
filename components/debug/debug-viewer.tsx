"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { ChevronUp, ChevronDown, X } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Mark from "mark.js"

interface DebugViewerProps {
  html: string
}

const scrollBehavior: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "center"
}

export function DebugViewer({ html }: DebugViewerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  // Using ref to avoid re-renders which can lead to mark tags being removed
  const markInstance = useRef<Mark | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const matchesRef = useRef<Element[]>([])
  const isInitialized = useRef(false)

  // Initialize mark.js instance and set initial content
  useEffect(() => {
    if (contentRef.current && !isInitialized.current) {
      contentRef.current.innerHTML = html
      markInstance.current = new Mark(contentRef.current)
      isInitialized.current = true
    }
    return () => {
      markInstance.current?.unmark()
    }
  }, [html])

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (!markInstance.current) return

    markInstance.current.unmark()
    matchesRef.current = []

    if (query) {
      markInstance.current.mark(query, {
        className: "bg-yellow-500/30 text-yellow-200",
        acrossElements: true,
        separateWordSearch: false,
        wildcards: "enabled",
        accuracy: {
          value: "partially",
          limiters: [",", ".", " ", "-", ":", "[", "]", "(", ")"]
        },
        each: (element: Element) => {
          matchesRef.current.push(element)
        },
        done: (matches: number) => {
          setTotalMatches(matches)
          setCurrentMatch(0)
          if (matches > 0) {
            matchesRef.current[0]?.scrollIntoView(scrollBehavior)
          }
        }
      })
    } else {
      setTotalMatches(0)
      setCurrentMatch(0)
    }
  }, [])

  const handleNextMatch = useCallback(() => {
    if (totalMatches === 0) return

    const nextMatch = (currentMatch + 1) % totalMatches
    setCurrentMatch(nextMatch)
    matchesRef.current[nextMatch]?.scrollIntoView(scrollBehavior)
  }, [currentMatch, totalMatches])

  const handlePrevMatch = useCallback(() => {
    if (totalMatches === 0) return

    const prevMatch = (currentMatch - 1 + totalMatches) % totalMatches
    setCurrentMatch(prevMatch)
    matchesRef.current[prevMatch]?.scrollIntoView(scrollBehavior)
  }, [currentMatch, totalMatches])

  return (
    <>
      <div className="relative md:mr-4">
        <Input
          type="text"
          placeholder="Find in logs..."
          value={searchQuery}
          onChange={handleSearch}
          className="pr-30"
        />
        {searchQuery && (
          <div className="-translate-y-1/2 absolute top-1/2 right-2 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery("")
                if (markInstance.current) {
                  markInstance.current.unmark()
                  setTotalMatches(0)
                  setCurrentMatch(0)
                }
              }}
            >
              <X />
            </Button>
            <span className="text-muted-foreground text-sm">
              {totalMatches > 0 ? currentMatch + 1 : 0}/{totalMatches}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={handlePrevMatch}
              disabled={totalMatches === 0}
              aria-label="Previous match"
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              onClick={handleNextMatch}
              disabled={totalMatches === 0}
              aria-label="Next match"
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="max-h-[60svh] overflow-y-auto overflow-x-auto md:pr-4 scrollbar-always-visible">
        {/* Custom colors for terminal like UI */}
        <div className="log-content relative bg-black/90 p-3 font-mono text-gray-200 text-sm min-w-full">
          <div ref={contentRef} />
        </div>
      </div>
    </>
  )
}
