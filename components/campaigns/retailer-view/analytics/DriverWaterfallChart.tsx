'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Driver {
  name: string;
  contribution: number;
  percentage: number;
  type: 'positive' | 'negative';
  description: string;
}

interface DriverWaterfallChartProps {
  data: {
    totalLift: number;
    drivers: Driver[];
    insights: string[];
  };
}

export default function DriverWaterfallChart({ data }: DriverWaterfallChartProps) {
  const { totalLift, drivers } = data;

  // Calculate cumulative values for waterfall effect
  let cumulativeValue = 0;
  const waterfallData = drivers.map((driver, index) => {
    const startValue = cumulativeValue;
    cumulativeValue += driver.contribution;
    return {
      ...driver,
      startValue,
      endValue: cumulativeValue,
      height: Math.abs(driver.contribution),
      isPositive: driver.type === 'positive'
    };
  });

  // Calculate chart dimensions with better proportions
  const maxAbsValue = Math.max(...waterfallData.map(d => Math.max(Math.abs(d.startValue), Math.abs(d.endValue))), Math.abs(totalLift));
  const chartHeight = 400;
  const chartWidth = Math.max(900, (drivers.length + 3) * 140); // Dynamic width
  const barWidth = Math.min(120, (chartWidth - 100) / (drivers.length + 3)); // Better spacing
  const chartPadding = 80;
  const availableHeight = chartHeight - (chartPadding * 2);

  const getBarHeight = (value: number) => {
    if (maxAbsValue === 0) return 20; // Minimum height for visibility
    return Math.max(20, (Math.abs(value) / maxAbsValue) * (availableHeight * 0.6)); // Use 60% of available height
  };
  
  const getBarY = (value: number) => {
    const centerY = chartHeight / 2;
    const barHeight = getBarHeight(value);
    if (value >= 0) {
      return centerY - barHeight;
    } else {
      return centerY;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${(value * 100).toFixed(1)}%`;
  };

  // Top 3 positive drivers and bottom 2 negative drivers
  const topDrivers = drivers
    .filter(d => d.type === 'positive')
    .sort((a, b) => b.contribution - a.contribution)
    .slice(0, 3);

  const bottomDrivers = drivers
    .filter(d => d.type === 'negative')
    .sort((a, b) => a.contribution - b.contribution)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Performance Driver Analysis
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shows how different factors contributed to the overall performance change</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <p className="text-gray-600">
            Breakdown of performance factors and their individual contributions
          </p>
        </CardHeader>
        <CardContent>
          {/* Waterfall Chart */}
          <div className="mb-8 overflow-x-auto bg-white rounded-lg border">
            <svg width={chartWidth} height={chartHeight} className="bg-gradient-to-b from-gray-50 to-white">
              {/* Grid lines for better readability */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />
              
              {/* Center line (zero line) */}
              <line
                x1={50}
                y1={chartHeight / 2}
                x2={chartWidth - 50}
                y2={chartHeight / 2}
                stroke="#9ca3af"
                strokeWidth={2}
                strokeDasharray="8,4"
              />

              {/* Driver bars */}
              {waterfallData.map((driver, driverIndex) => {
                const x = 60 + driverIndex * (barWidth + 20);
                const barHeight = getBarHeight(driver.contribution);
                const y = getBarY(driver.contribution);
                const color = driver.isPositive ? '#059669' : '#dc2626';
                const lightColor = driver.isPositive ? '#d1fae5' : '#fee2e2';

                return (
                  <g key={driver.name}>


                    {/* Bar shadow */}
                    <rect
                      x={x + 2}
                      y={y + 2}
                      width={barWidth - 20}
                      height={barHeight}
                      fill="#00000010"
                      rx={6}
                    />

                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 20}
                      height={barHeight}
                      fill={color}
                      rx={6}
                      className="hover:opacity-90 cursor-pointer transition-opacity"
                    />

                    {/* Bar gradient overlay */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth - 20}
                      height={barHeight / 3}
                      fill={lightColor}
                      rx={6}
                      opacity={0.3}
                    />

                    {/* Value label */}
                    <text
                      x={x + (barWidth - 20) / 2}
                      y={driver.isPositive ? y - 8 : y + barHeight + 16}
                      textAnchor="middle"
                      className="text-sm font-bold"
                      fill={color}
                    >
                      {formatPercentage(driver.contribution)}
                    </text>

                    {/* Driver name */}
                    <text
                      x={x + (barWidth - 20) / 2}
                      y={chartHeight - 45}
                      textAnchor="middle"
                      className="text-xs font-medium fill-gray-700"
                    >
                      {driver.name.length > 12 ? driver.name.substring(0, 12) + '...' : driver.name}
                    </text>
                    
                    {/* Additional info on hover */}
                    <title>{`${driver.name}: ${formatPercentage(driver.contribution)}`}</title>
                  </g>
                );
              })}


            </svg>
          </div>

          {/* Driver Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Drivers */}
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Top 3 Performance Drivers
              </h3>
              <div className="space-y-3">
                {topDrivers.map((driver, index) => (
                  <div key={driver.name} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-green-900">{driver.name}</h4>
                        <span className="text-green-700 font-semibold">
                          +{driver.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-green-700">{driver.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Drags */}
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Performance Drags
              </h3>
              <div className="space-y-3">
                {bottomDrivers.map((driver, index) => (
                  <div key={driver.name} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-red-900">{driver.name}</h4>
                        <span className="text-red-700 font-semibold">
                          {driver.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-red-700">{driver.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}