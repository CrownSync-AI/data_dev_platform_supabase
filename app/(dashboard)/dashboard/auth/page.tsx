"use client"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthPage() {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Authentication Pages</h1>
        <p className="text-muted-foreground">Authentication pages have been removed. This is now a placeholder page.</p>
      </div>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">No Auth Pages</CardTitle>
          <p className="text-sm text-muted-foreground text-center">
            Authentication functionality has been removed from this dashboard.
          </p>
        </CardHeader>
      </Card>
    </div>
  )
}
