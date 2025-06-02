"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface EmailTooltipProps {
  email: string
  botUuid: string
  className?: string
  children: React.ReactNode
}

export const EmailTooltip = ({ email, botUuid, className, children }: EmailTooltipProps) => {
  const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const subject = "MeetingBaaS Support"
    const embedLink = `${window.location.href}&bot_uuid=${botUuid}`
    const body = `Hi,\n\nI'm contacting you regarding your bot ${botUuid} (${embedLink}).`
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleEmailClick}
          className={cn("cursor-pointer text-sm hover:opacity-80", className)}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Click to send an email</p>
      </TooltipContent>
    </Tooltip>
  )
}
