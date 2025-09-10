import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle } from "lucide-react"

export default function ErrorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Error Pages</h1>
        <p className="text-muted-foreground">Error pages have been removed from this dashboard template.</p>
      </div>

      <Separator />

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <CardTitle>No Error Pages</CardTitle>
              <Badge variant="secondary">Removed</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Custom error pages (404, 401, 403, 500, maintenance) have been removed from this dashboard. Only the default
            Next.js error handling remains.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
