"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { JwtProvider } from "@/contexts/jwt-context"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ScreenshotViewerProvider } from "../contexts/screenshot-viewer-context"

const queryClient = new QueryClient()

export default function Providers({
  children,
  jwt
}: Readonly<{
  children: React.ReactNode
  jwt: string
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <JwtProvider jwt={jwt}>
        <QueryClientProvider client={queryClient}>
          <ScreenshotViewerProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ScreenshotViewerProvider>
        </QueryClientProvider>
      </JwtProvider>
    </ThemeProvider>
  )
}
