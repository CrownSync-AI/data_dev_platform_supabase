'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SocialMetricCardProps } from '@/lib/types/social-media';

export function SocialMetricCard({
  title,
  value,
  change,
  platform,
  icon,
  trend = 'neutral'
}: SocialMetricCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPlatformColor = () => {
    switch (platform) {
      case 'linkedin':
        return 'border-l-blue-500';
      case 'instagram':
        return 'border-l-pink-500';
      case 'facebook':
        return 'border-l-blue-600';
      case 'google':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-400';
    }
  };

  return (
    <Card className={cn('border-l-4', getPlatformColor())}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <Badge 
              variant="secondary" 
              className={cn('text-xs mt-1', getTrendColor())}
            >
              {getTrendIcon()}
              <span className="ml-1">{change}</span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}