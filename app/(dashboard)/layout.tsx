import type React from "react"
import { DashboardLayoutClient } from "@/components/shared/dashboard-layout-client"
import { ChatPersistenceProvider } from "@/components/providers/ChatPersistenceProvider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatPersistenceProvider>
      <DashboardLayoutClient>
        {children}
      </DashboardLayoutClient>
    </ChatPersistenceProvider>
  )
}
