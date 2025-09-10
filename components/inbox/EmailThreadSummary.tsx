'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  User, 
  CheckCircle, 
  AlertCircle,
  Clock,
  TrendingUp
} from 'lucide-react'
import { EmailThreadSummary as EmailThreadSummaryType } from '@/lib/types/email'
import { cn } from '@/lib/utils'

interface EmailThreadSummaryProps {
  summary: EmailThreadSummaryType
  customerName: string
  className?: string
}

export default function EmailThreadSummary({ 
  summary, 
  customerName: _customerName, 
  className 
}: EmailThreadSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="h-3 w-3" />
      case 'negative':
        return <AlertCircle className="h-3 w-3" />
      case 'urgent':
        return <Clock className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  return (
    <Card className={cn("mb-4 border-l-4 border-l-blue-500", className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-blue-600">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI Summary</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getSentimentColor(summary.sentiment)}`}
            >
              {getSentimentIcon(summary.sentiment)}
              <span className="ml-1 capitalize">{summary.sentiment}</span>
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 px-2"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Overview */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {summary.overview}
          </p>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="space-y-4 pt-3 border-t border-gray-100">
            {/* Key Points */}
            {summary.keyPoints.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Key Points
                </h4>
                <ul className="space-y-1">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer Needs */}
            {summary.customerNeeds.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2 text-green-600" />
                  Customer Needs
                </h4>
                <ul className="space-y-1">
                  {summary.customerNeeds.map((need, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {need}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Items */}
            {summary.actionItems.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
                  Action Items
                </h4>
                <ul className="space-y-1">
                  {summary.actionItems.map((action, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 mr-2 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Generated timestamp */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Generated {new Date(summary.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}