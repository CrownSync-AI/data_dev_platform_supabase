"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const sidebarGroups = [
  {
    title: "Brand View",
    items: [
      {
        title: "Campaign Performance",
        href: "/dashboard/brand-performance/campaign-performance",
        icon: TrendingUp,
        description: "Comprehensive campaign analytics with social and email performance insights",
      },
      {
        title: "Campaign Performance – Deliverable",
        href: "/dashboard/brand-performance/campaign-performance-deliverable",
        icon: TrendingUp,
        description: "Realistic deliverable version based on current capabilities",
      },
      {
        title: "Campaign Intelligence – Jesse",
        href: "/dashboard/brand-performance/campaign-intelligence",
        icon: Share2,
        description: "Advanced campaign intelligence and performance optimization insights",
      },
    ],
  },
  {
    title: "Retailer View",
    items: [
      {
        title: "Campaign Performance",
        href: "/dashboard/retailer-view/campaign-performance",
        icon: TrendingUp,
        description: "Retailer-specific campaign performance and analytics",
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-gray-50/50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 justify-between">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-sm font-bold leading-tight">CrownSync Internal Data Dev Platform (for Beansmile)</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-6 p-4">
        {sidebarGroups.map((group) => (
          <div key={group.title} className="space-y-2">
            {/* Group Title */}
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">{group.title}</h3>
            )}

            {/* Group Items */}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                      isActive ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary",
                      isCollapsed && "justify-center px-2",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}
