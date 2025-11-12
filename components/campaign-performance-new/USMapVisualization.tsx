'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

const regionalData = {
  Northeast: {
    retailers: 3,
    posts: 58,
    engagement: 15240,
    reach: 342000,
    engagementRate: 4.46,
    performance: 92,
    growth: 18.5,
    topRetailer: 'Luxury Boutique NYC',
    states: ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD'],
  },
  West: {
    retailers: 2,
    posts: 42,
    engagement: 8960,
    reach: 198000,
    engagementRate: 4.53,
    performance: 88,
    growth: 15.2,
    topRetailer: 'Fashion Forward LA',
    states: ['WA', 'OR', 'CA', 'NV', 'ID', 'MT', 'WY', 'UT', 'CO', 'AZ', 'NM', 'AK', 'HI'],
  },
  South: {
    retailers: 3,
    posts: 52,
    engagement: 10960,
    reach: 264000,
    engagementRate: 4.15,
    performance: 89,
    growth: 16.9,
    topRetailer: 'Trend Setters Miami',
    states: ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL'],
  },
  Midwest: {
    retailers: 2,
    posts: 32,
    engagement: 7420,
    reach: 156000,
    engagementRate: 4.76,
    performance: 85,
    growth: 12.8,
    topRetailer: 'Style Central Chicago',
    states: ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'MI', 'IN', 'OH'],
  },
}

// Map state names to abbreviations
const stateNameToAbbr: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
}

const getColorIntensity = (value: number, metric: string): string => {
  // Different thresholds for different metrics
  if (metric === 'performance') {
    if (value >= 90) return '#10B981'
    if (value >= 85) return '#34D399'
    if (value >= 80) return '#6EE7B7'
    if (value >= 75) return '#FCD34D'
    return '#F87171'
  } else if (metric === 'engagementRate') {
    if (value >= 4.5) return '#10B981'
    if (value >= 4.0) return '#34D399'
    if (value >= 3.5) return '#6EE7B7'
    if (value >= 3.0) return '#FCD34D'
    return '#F87171'
  } else if (metric === 'growth') {
    if (value >= 15) return '#10B981'
    if (value >= 12) return '#34D399'
    if (value >= 10) return '#6EE7B7'
    if (value >= 8) return '#FCD34D'
    return '#F87171'
  } else if (metric === 'reach') {
    if (value >= 300000) return '#10B981'
    if (value >= 200000) return '#34D399'
    if (value >= 150000) return '#6EE7B7'
    if (value >= 100000) return '#FCD34D'
    return '#F87171'
  }
  return '#E5E7EB'
}

interface USMapVisualizationProps {
  selectedMetric?: 'performance' | 'engagementRate' | 'reach' | 'growth'
}

function USMapVisualization({
  selectedMetric: externalSelectedMetric,
}: USMapVisualizationProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'engagementRate' | 'reach' | 'growth'>(
    externalSelectedMetric || 'performance'
  )

  const getMetricValue = (regionData: any, metric: string) => {
    switch (metric) {
      case 'performance':
        return `${regionData.performance}%`
      case 'engagementRate':
        return `${regionData.engagementRate}%`
      case 'reach':
        return `${(regionData.reach / 1000).toFixed(0)}K`
      case 'growth':
        return `+${regionData.growth}%`
      default:
        return `${regionData.performance}%`
    }
  }

  const getRegionForState = (stateName: string): string | null => {
    const stateAbbr = stateNameToAbbr[stateName]
    if (!stateAbbr) return null

    for (const [region, data] of Object.entries(regionalData)) {
      if (data.states.includes(stateAbbr)) {
        return region
      }
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              U.S. Regional Performance Map
            </CardTitle>
            <p className="text-sm text-gray-600">
              Interactive heat map showing campaign performance across U.S. regions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View by:</span>
            <div className="flex gap-1">
              <Button
                variant={selectedMetric === 'performance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('performance')}
              >
                Performance
              </Button>
              <Button
                variant={selectedMetric === 'engagementRate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('engagementRate')}
              >
                Engagement
              </Button>
              <Button
                variant={selectedMetric === 'reach' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('reach')}
              >
                Reach
              </Button>
              <Button
                variant={selectedMetric === 'growth' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('growth')}
              >
                Growth
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-6">
          {/* Map Container */}
          <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-4 border border-gray-200 h-[400px]">
            <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name
                    const region = getRegionForState(stateName)
                    const regionData = region
                      ? regionalData[region as keyof typeof regionalData]
                      : null

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          regionData
                            ? getColorIntensity(
                                regionData[selectedMetric as keyof typeof regionData] as number,
                                selectedMetric
                              )
                            : '#E5E7EB'
                        }
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: regionData
                              ? getColorIntensity(
                                  regionData[selectedMetric as keyof typeof regionData] as number,
                                  selectedMetric
                                )
                              : '#E5E7EB',
                            opacity: 0.8,
                            outline: 'none',
                            stroke: '#3B82F6',
                            strokeWidth: 2,
                            cursor: 'pointer',
                          },
                          pressed: { outline: 'none' },
                        }}
                        onMouseEnter={() => {
                          if (region) setHoveredRegion(region)
                        }}
                        onMouseLeave={() => {
                          setHoveredRegion(null)
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Hover Tooltip */}
          {hoveredRegion && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-xl border-2 border-blue-200 z-10 min-w-64 animate-in fade-in duration-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                {hoveredRegion} Region
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-gray-600">Performance:</span>
                  <span className="font-semibold text-gray-900">
                    {
                      regionalData[
                        hoveredRegion as keyof typeof regionalData
                      ].performance
                    }
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-gray-600">Engagement Rate:</span>
                  <span className="font-semibold text-gray-900">
                    {
                      regionalData[
                        hoveredRegion as keyof typeof regionalData
                      ].engagementRate
                    }
                    %
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-gray-600">Total Reach:</span>
                  <span className="font-semibold text-gray-900">
                    {(
                      regionalData[
                        hoveredRegion as keyof typeof regionalData
                      ].reach / 1000
                    ).toFixed(0)}
                    K
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6">
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-semibold text-green-600">
                    +
                    {
                      regionalData[
                        hoveredRegion as keyof typeof regionalData
                      ].growth
                    }
                    %
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <div className="flex items-center justify-between gap-6">
                    <span className="text-gray-600">Top Retailer:</span>
                    <span className="font-medium text-blue-600 text-xs">
                      {
                        regionalData[
                          hoveredRegion as keyof typeof regionalData
                        ].topRetailer
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>

          {/* Scale Legend - Right Side */}
          <div className="w-64 flex flex-col justify-center">
            <h4 className="font-semibold text-gray-800 mb-4">
              {selectedMetric === 'performance' && 'Performance Scale'}
              {selectedMetric === 'engagementRate' && 'Engagement Rate Scale'}
              {selectedMetric === 'reach' && 'Reach Scale'}
              {selectedMetric === 'growth' && 'Growth Scale'}
            </h4>
            <div className="space-y-3 text-sm">
              {selectedMetric === 'performance' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10B981' }}></div>
                    <span>Excellent (90%+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#34D399' }}></div>
                    <span>Good (85-89%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#6EE7B7' }}></div>
                    <span>Fair (80-84%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
                    <span>Below Avg (75-79%)</span>
                  </div>
                </>
              )}
              {selectedMetric === 'engagementRate' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10B981' }}></div>
                    <span>Excellent (4.5%+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#34D399' }}></div>
                    <span>Good (4.0-4.5%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#6EE7B7' }}></div>
                    <span>Fair (3.5-4.0%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
                    <span>Below Avg (3.0-3.5%)</span>
                  </div>
                </>
              )}
              {selectedMetric === 'reach' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10B981' }}></div>
                    <span>Excellent (300K+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#34D399' }}></div>
                    <span>Good (200-300K)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#6EE7B7' }}></div>
                    <span>Fair (150-200K)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
                    <span>Below Avg (100-150K)</span>
                  </div>
                </>
              )}
              {selectedMetric === 'growth' && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#10B981' }}></div>
                    <span>Excellent (15%+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#34D399' }}></div>
                    <span>Good (12-15%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#6EE7B7' }}></div>
                    <span>Fair (10-12%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: '#FCD34D' }}></div>
                    <span>Below Avg (8-10%)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(regionalData).reduce(
                (sum, region) => sum + region.retailers,
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Total Retailers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {Object.values(regionalData).reduce(
                (sum, region) => sum + region.posts,
                0
              )}
            </p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(
                Object.values(regionalData).reduce(
                  (sum, region) => sum + region.reach,
                  0
                ) / 1000000
              ).toFixed(1)}
              M
            </p>
            <p className="text-sm text-gray-600">Total Reach</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(
                Object.values(regionalData).reduce(
                  (sum, region) => sum + region.performance,
                  0
                ) / Object.values(regionalData).length
              ).toFixed(0)}
              %
            </p>
            <p className="text-sm text-gray-600">Avg Performance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default USMapVisualization
