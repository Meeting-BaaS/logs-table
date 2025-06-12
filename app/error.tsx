"use client"

import { spotlightVariant } from "@/lib/animations/background"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import Image from "next/image"
import { useEffect } from "react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error }: ErrorProps) {
  useEffect(() => {
    console.error("Something went wrong", error)
  }, [error])

  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@meetingbaas.com"

  return (
    <div className="relative flex max-h-screen max-w-screen grow flex-col items-center justify-center">
      <div className="z-10 flex flex-col items-center justify-center gap-10 p-4 text-center">
        <h1 className="font-bold text-3xl">Oops...something went wrong</h1>
        <Image
          src="/error.svg"
          alt="Illustration showing an application error state"
          width={484}
          height={127}
          priority
        />
        <div className="max-w-4xl text-lg">
          <p className="mb-1">
            {error.message ? error.message : "There was an unknown error. Please refresh the page."}
          </p>
          If the error persists, please contact us on{" "}
          <Button variant="link" asChild className="h-auto p-0 text-lg">
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </Button>
        </div>
      </div>
      <motion.div
        className="-translate-1/2 absolute top-1/2 left-1/2 h-64 w-64 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 219, 205, 0.3) 10%, rgba(0, 219, 205, 0.2) 80%, transparent 100%)"
        }}
        initial={{ opacity: 0 }}
        animate={spotlightVariant}
        aria-hidden="true"
      />
    </div>
  )
}
