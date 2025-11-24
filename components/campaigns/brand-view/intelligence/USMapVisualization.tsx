'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

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
  regionalData: any[]
}

function USMapVisualization({
  selectedMetric: externalSelectedMetric,
  regionalData: propRegionalData
}: USMapVisualizationProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'engagementRate' | 'reach' | 'growth'>(
    externalSelectedMetric || 'performance'
  )

  // Convert array to object for map lookup if needed, or use the prop directly
  // The prop is an array in RegionalHeatmap, but USMapVisualization used an object.
  // Let's normalize it. The map expects an object keyed by Region Name.
  const normalizedRegionalData = Array.isArray(propRegionalData)
    ? propRegionalData.reduce((acc, region) => {
      acc[region.region] = {
        ...region,
        // Add states if missing (RegionalHeatmap data doesn't have states list, USMapVisualization internal data did)
        // We need to preserve the state mapping.
        states: getStatesForRegion(region.region)
      }
      return acc
    }, {} as any)
    : propRegionalData

  const getRegionForState = (stateName: string): string | null => {
    const stateAbbr = stateNameToAbbr[stateName]
    if (!stateAbbr) return null

    for (const [region, data] of Object.entries(normalizedRegionalData)) {
      if ((data as any).states.includes(stateAbbr)) {
        return region
      }
    }
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-medium">Metric:</span>
          <div className="flex gap-1">
            <Button
              variant={selectedMetric === 'performance' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('performance')}
              className="h-8 text-xs"
            >
              Performance
            </Button>
            <Button
              variant={selectedMetric === 'engagementRate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('engagementRate')}
              className="h-8 text-xs"
            >
              Engagement
            </Button>
            <Button
              variant={selectedMetric === 'reach' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('reach')}
              className="h-8 text-xs"
            >
              Reach
            </Button>
            <Button
              variant={selectedMetric === 'growth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMetric('growth')}
              className="h-8 text-xs"
            >
              Growth
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Map Container */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-50/50 to-gray-50/50 rounded-xl p-4 border border-gray-100 h-[400px]">
          <ComposableMap projection="geoAlbersUsa" className="w-full h-full">
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName = geo.properties.name
                    const region = getRegionForState(stateName)
                    const regionData = region
                      ? normalizedRegionalData[region]
                      : null

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={
                          regionData
                            ? getColorIntensity(
                              regionData[selectedMetric],
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
                                regionData[selectedMetric],
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
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 z-10 min-w-[200px] animate-in fade-in duration-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                {hoveredRegion}
              </h4>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Performance</span>
                  <span className="font-semibold text-gray-900">
                    {normalizedRegionalData[hoveredRegion].performance}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Engagement</span>
                  <span className="font-semibold text-gray-900">
                    {normalizedRegionalData[hoveredRegion].engagementRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Reach</span>
                  <span className="font-semibold text-gray-900">
                    {(normalizedRegionalData[hoveredRegion].reach / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-gray-500">Growth</span>
                  <span className="font-semibold text-green-600">
                    +{normalizedRegionalData[hoveredRegion].growth}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper to get states for a region (moved from internal data)
function getStatesForRegion(region: string): string[] {
  const map: Record<string, string[]> = {
    'Northeast': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD'],
    'East': ['ME', 'NH', 'VT', 'MA', 'RI', 'CT', 'NY', 'NJ', 'PA', 'DE', 'MD'], // Handle both East and Northeast
    'West': ['WA', 'OR', 'CA', 'NV', 'ID', 'MT', 'WY', 'UT', 'CO', 'AZ', 'NM', 'AK', 'HI'],
    'South': ['TX', 'OK', 'AR', 'LA', 'MS', 'AL', 'TN', 'KY', 'WV', 'VA', 'NC', 'SC', 'GA', 'FL'],
    'Midwest': ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'MI', 'IN', 'OH'],
    'Central': ['ND', 'SD', 'NE', 'KS', 'MN', 'IA', 'MO', 'WI', 'IL', 'MI', 'IN', 'OH'], // Handle Central as Midwest
    'North': ['MN', 'WI', 'MI'] // Approximate for North if used
  }
  return map[region] || []
}

export default USMapVisualization
