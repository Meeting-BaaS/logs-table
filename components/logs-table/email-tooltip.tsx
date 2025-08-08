"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Copy, Mail } from "lucide-react"

interface EmailTooltipProps {
  email: string
  botUuid: string
  className?: string
  children: React.ReactNode
}

export const EmailTooltip = ({ email, botUuid, className, children }: EmailTooltipProps) => {
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleCopyEmail = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setIsOpen(true)
      toast.success("Email copied to clipboard")
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
      toast.error("Failed to copy email")
    }
  }

  const handleSendEmail = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("bot_uuid", botUuid)
    const embedLink = `${window.location.origin}${window.location.pathname}?${newSearchParams.toString()}`

    const subject = "MeetingBaaS Support"
    const body = `Hi,\n\nI'm contacting you regarding your bot ${botUuid} (${embedLink}).`
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    try {
      window.location.href = mailtoLink
    } catch (error) {
      console.error("Failed to open email client:", error)
      toast.error("Failed to open email client")
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Email options for ${email}`}
          className={cn("cursor-pointer text-sm hover:opacity-80", className)}
        >
          {children}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={handleCopyEmail}>
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy email"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" />
          Send email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
