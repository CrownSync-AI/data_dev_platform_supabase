import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Performance - CrownSync',
  description: '品牌方专用的Campaign效果分析和经销商表现管理平台',
}

export default function BrandPerformanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {children}
    </div>
  )
} 