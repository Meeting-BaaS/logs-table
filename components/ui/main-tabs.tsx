import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface Tab {
  id: string
  label: string
  count?: number | null
}

interface MainTabsProps {
  currentTab: string
  setCurrentTab: (tabId: string) => void
  tabs: Tab[]
  disabled?: boolean
  layoutId?: string
  containerClassName?: string
}

export const MainTabs = ({
  currentTab,
  setCurrentTab,
  tabs,
  disabled,
  layoutId = "tabs-underline",
  containerClassName
}: MainTabsProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start border-l sm:flex-row sm:border-b sm:border-l-0",
        containerClassName
      )}
    >
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.id}
          className={cn(
            "group relative px-5 py-3 transition-colors",
            currentTab === tab.id
              ? "font-semibold text-primary disabled:font-normal disabled:text-muted-foreground/40"
              : "text-muted-foreground after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:h-full after:w-1 after:bg-transparent after:transition-colors hover:text-foreground hover:after:bg-muted-foreground focus:outline-none disabled:text-muted-foreground/40 sm:after:top-auto sm:after:h-0.5 sm:after:w-full"
          )}
          onClick={() => setCurrentTab(tab.id)}
          disabled={disabled}
          role="tab"
          aria-selected={currentTab === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          id={`tab-${tab.id}`}
        >
          {tab.label}
          {tab.count && tab.count > 0 && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground text-xs ml-1">
              {tab.count}
            </span>
          )}
          {currentTab === tab.id ? (
            <motion.div
              layoutId={layoutId}
              className={cn(
                "absolute top-0 left-0 h-full w-1 rounded-r-md sm:top-auto sm:right-0 sm:bottom-0 sm:h-0.5 sm:w-full sm:rounded-t-md",
                disabled ? "bg-muted-foreground/40" : "bg-primary"
              )}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
                duration: 0.3
              }}
            />
          ) : null}
        </button>
      ))}
    </div>
  )
}
