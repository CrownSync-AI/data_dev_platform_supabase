'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react'
import RetailerPerformanceCard from './RetailerPerformanceCard'

interface RetailerData {
  retailer_id: string
  retailer_name: string
  retailer_email: string
  region: 'East' | 'Central' | 'West'
  emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  overall_rank: number
  region_rank: number
  performance_tier: string
  // Additional fields for card display
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  trend: number
  responseTime: string
  lastCampaignDate: string
}

interface RetailerPerformanceGridProps {
  campaignId: string
  startDate?: Date
  endDate?: Date
}

export default function RetailerPerformanceGrid({ campaignId, startDate, endDate }: RetailerPerformanceGridProps) {
  const [retailers, setRetailers] = useState<RetailerData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('overall_rank')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    fetchRetailerData()
  }, [campaignId, startDate, endDate])

  const fetchRetailerData = async () => {
    try {
      setLoading(true)
      
      // Build API URL with time parameters
      let apiUrl = `/api/campaigns/${campaignId}/analytics?limit=50&sort_by=${sortBy}&sort_order=${sortOrder}`
      
      if (startDate) {
        apiUrl += `&start_date=${startDate.toISOString()}`
      }
      if (endDate) {
        apiUrl += `&end_date=${endDate.toISOString()}`
      }
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Failed to fetch retailer data')
      }
      
      const result = await response.json()
      
      // Enhance the data with additional fields for card display
      const enhancedRetailers = result.leaderboard.map((retailer: any, index: number) => ({
        ...retailer,
        grade: getGradeFromPerformance(retailer.click_rate),
        trend: Math.random() * 10 - 5, // Random trend for demo
        responseTime: `${(Math.random() * 10 + 2).toFixed(1)}h`,
        lastCampaignDate: getRandomDate()
      }))
      
      setRetailers(enhancedRetailers)
    } catch (error) {
      console.error('Error fetching retailer data:', error)
      
      // Use fallback mock data
      const mockRetailers: RetailerData[] = [
        {
          retailer_id: '1',
          retailer_name: 'Cartier Rodeo Drive',
          retailer_email: 'cartier@rodeo.com',
          region: 'West',
          emails_sent: 892,
          emails_delivered: 875,
          emails_opened: 394,
          emails_clicked: 41,
          delivery_rate: 98.1,
          open_rate: 45.0,
          click_rate: 4.64,
          overall_rank: 1,
          region_rank: 1,
          performance_tier: 'Top',
          grade: 'A+',
          trend: 8.5,
          responseTime: '2.5h',
          lastCampaignDate: '2025-01-18'
        },
        {
          retailer_id: '2',
          retailer_name: 'Betteridge NY',
          retailer_email: 'betteridge@ny.com',
          region: 'East',
          emails_sent: 1156,
          emails_delivered: 1134,
          emails_opened: 483,
          emails_clicked: 44,
          delivery_rate: 98.1,
          open_rate: 42.6,
          click_rate: 3.87,
          overall_rank: 2,
          region_rank: 1,
          performance_tier: 'Top',
          grade: 'A',
          trend: 5.2,
          responseTime: '4.2h',
          lastCampaignDate: '2025-01-17'
        },
        // Add more mock data...
      ]
      
      setRetailers(mockRetailers)
    } finally {
      setLoading(false)
    }
  }

  const getGradeFromPerformance = (clickRate: number): 'A+' | 'A' | 'B' | 'C' | 'D' => {
    if (clickRate >= 4.0) return 'A+'
    if (clickRate >= 3.5) return 'A'
    if (clickRate >= 2.5) return 'B'
    if (clickRate >= 1.5) return 'C'
    return 'D'
  }

  const getRandomDate = () => {
    const days = Math.floor(Math.random() * 30) + 1
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  }

  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = retailer.retailer_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === 'all' || retailer.region === regionFilter
    const matchesGrade = gradeFilter === 'all' || retailer.grade === gradeFilter
    return matchesSearch && matchesRegion && matchesGrade
  })

  const sortedRetailers = [...filteredRetailers].sort((a, b) => {
    let aValue = a[sortBy as keyof RetailerData]
    let bValue = b[sortBy as keyof RetailerData]
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase()
    if (typeof bValue === 'string') bValue = bValue.toLowerCase()
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search retailers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="East">East</SelectItem>
              <SelectItem value="Central">Central</SelectItem>
              <SelectItem value="West">West</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Grades</SelectItem>
              <SelectItem value="A+">A+</SelectItem>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall_rank">Rank</SelectItem>
              <SelectItem value="click_rate">Click Rate</SelectItem>
              <SelectItem value="emails_sent">Volume</SelectItem>
              <SelectItem value="retailer_name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedRetailers.length} of {retailers.length} retailers
        </p>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {searchTerm || regionFilter !== 'all' || gradeFilter !== 'all' ? 'Filtered' : 'All'} Results
          </span>
        </div>
      </div>

      {/* Retailer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedRetailers.map((retailer) => (
          <RetailerPerformanceCard
            key={retailer.retailer_id}
            rank={retailer.overall_rank}
            name={retailer.retailer_name}
            region={retailer.region}
            clickRate={retailer.click_rate}
            emailsSent={retailer.emails_sent}
            emailsDelivered={retailer.emails_delivered}
            emailsOpened={retailer.emails_opened}
            emailsClicked={retailer.emails_clicked}
            trend={retailer.trend}
            responseTime={retailer.responseTime}
            grade={retailer.grade}
            lastCampaignDate={retailer.lastCampaignDate}
            overallRank={retailer.overall_rank}
            performanceTier={retailer.performance_tier}
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedRetailers.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No retailers found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              setRegionFilter('all')
              setGradeFilter('all')
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
} 