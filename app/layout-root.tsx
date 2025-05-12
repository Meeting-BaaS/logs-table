"use client"

import type { Session } from "@/lib/auth/types"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import type { MenuOption } from "@/components/header/menu-options"

interface LayoutRootProps {
  session: Session
  children: React.ReactNode
  avatarMenuOptions: readonly MenuOption[]
}

export default function LayoutRoot({
  children,
  session: initialSession,
  avatarMenuOptions
}: LayoutRootProps) {
  const session = useSession(initialSession)

  if (!session) {
    return null
  }

  return (
    <>
      <Header user={session.user} avatarMenuOptions={avatarMenuOptions} />
      <main className="grow">{children}</main>
      <Footer />
    </>
  )
}
