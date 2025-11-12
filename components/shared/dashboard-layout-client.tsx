'use client'

import type React from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/shared/sidebar"
import { Topbar } from "@/components/shared/topbar"
import { FloatingAIButton } from "@/components/shared/floating-ai-button"

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChatPage = pathname === '/dashboard/chat'

  if (isChatPage) {
    // Full-screen chat layout
    return (
      <div className="relative h-screen overflow-hidden">
        {/* Full-screen chat content */}
        <main className="h-full">{children}</main>
        
        {/* Floating Back Button (replaces AI button on chat page) */}
        <FloatingAIButton />
      </div>
    )
  }

  // Standard dashboard layout
  return (
    <div className="relative flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>

      {/* Floating AI Assistant Button */}
      <FloatingAIButton />
    </div>
  )
}