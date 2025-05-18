import { ArrowLeft } from "lucide-react"
import { Button } from "../ui/button"
import { AnimatePresence, motion } from "motion/react"

const MotionButton = motion(Button)

interface BackToAllLogsProps {
  botUuids: string[]
  setBotUuids: (botUuids: string[]) => void
}

export const BackToAllLogs = ({ botUuids, setBotUuids }: BackToAllLogsProps) => {
  return (
    <AnimatePresence mode="wait">
      {botUuids.length > 0 && (
        <MotionButton
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variant="outline"
          onClick={() => setBotUuids([])}
        >
          <ArrowLeft />
          Back to all logs
        </MotionButton>
      )}
    </AnimatePresence>
  )
}
