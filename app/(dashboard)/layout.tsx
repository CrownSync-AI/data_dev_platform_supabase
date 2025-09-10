import type React from "react"
import { Sidebar } from "@/components/shared/sidebar"
import { Topbar } from "@/components/shared/topbar"
import { ChatPersistenceProvider } from "@/components/providers/ChatPersistenceProvider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ChatPersistenceProvider>
      <div className="relative flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ChatPersistenceProvider>
  )
}
