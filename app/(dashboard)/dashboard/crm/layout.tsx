import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM - CrowSync',
  description: 'Customer relationship management dashboard',
}

export default function CRMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  )
} 