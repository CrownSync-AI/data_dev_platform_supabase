'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { 
  Filter, 
  Search, 
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  SortAsc,
  X
} from 'lucide-react'
import { format } from 'date-fns'

interface FilterState {
  status: string
  type: string
  performanceTier: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  search: string
}

interface CampaignFiltersAndViewsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: 'card' | 'list'
  onViewModeChange: (mode: 'card' | 'list') => void
  totalResults: number
}

export default function CampaignFiltersAndViews({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults
}: CampaignFiltersAndViewsProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      performanceTier: 'all',
      dateRange: { from: undefined, to: undefined },
      search: ''
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status !== 'all') count++
    if (filters.type !== 'all') count++
    if (filters.performanceTier !== 'all') count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.search) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search campaigns..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Campaign Type Filter */}
          <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>

          {/* Performance Tier Filter */}
          <Select value={filters.performanceTier} onValueChange={(value) => updateFilter('performanceTier', value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="high">High Performer</SelectItem>
              <SelectItem value="good">Good Performer</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range Filter */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd")} -{" "}
                      {format(filters.dateRange.to, "LLL dd")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={{
                  from: filters.dateRange.from,
                  to: filters.dateRange.to
                }}
                onSelect={(range) => {
                  updateFilter('dateRange', {
                    from: range?.from,
                    to: range?.to
                  })
                  if (range?.from && range?.to) {
                    setIsDatePickerOpen(false)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center gap-2">
          {/* Sort By */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[140px]">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated">Last Updated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="start-date">Start Date</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('card')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              Status: {filters.status}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('status', 'all')}
              />
            </Badge>
          )}
          {filters.type !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              Type: {filters.type}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('type', 'all')}
              />
            </Badge>
          )}
          {filters.performanceTier !== 'all' && (
            <Badge variant="secondary" className="capitalize">
              Performance: {filters.performanceTier}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('performanceTier', 'all')}
              />
            </Badge>
          )}
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary">
              Date Range
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('dateRange', { from: undefined, to: undefined })}
              />
            </Badge>
          )}
          {filters.search && (
            <Badge variant="secondary">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        {totalResults} campaign{totalResults !== 1 ? 's' : ''} found
      </div>
    </div>
  )
}