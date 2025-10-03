'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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
  Search, 
  Calendar as CalendarIcon,
  Grid3X3,
  List,
  X
} from 'lucide-react'
import { format } from 'date-fns'

// Custom CSS for date range highlighting on calendar
const calendarStyles = `
  .date-range-calendar .MuiPickersDay-root {
    position: relative;
  }
  
  .date-range-calendar .MuiPickersDay-root.Mui-selected {
    background-color: #3b82f6 !important;
    color: white !important;
    font-weight: 600 !important;
  }
  
  .date-range-calendar .MuiPickersDay-root:hover {
    background-color: rgba(59, 130, 246, 0.1) !important;
  }
  
  .date-range-calendar .MuiPickersDay-root.range-start {
    background-color: #3b82f6 !important;
    color: white !important;
    font-weight: 600 !important;
  }
  
  .date-range-calendar .MuiPickersDay-root.range-end {
    background-color: #3b82f6 !important;
    color: white !important;
    font-weight: 600 !important;
  }
  
  .date-range-calendar .MuiPickersDay-root.in-range {
    background-color: rgba(59, 130, 246, 0.2) !important;
    color: #1f2937 !important;
  }
`

interface FilterState {
  status: string
  type: string
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  search: string
}

interface CampaignFiltersAndViewsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  viewMode: 'card' | 'list'
  onViewModeChange: (mode: 'card' | 'list') => void
  totalResults: number
}

export default function CampaignFiltersAndViews({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  totalResults
}: CampaignFiltersAndViewsProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    onFiltersChange(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  }, [onFiltersChange]);

  const clearAllFilters = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      dateRange: { from: undefined, to: undefined },
      search: ''
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status !== 'all') count++
    if (filters.type !== 'all') count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    if (filters.search) count++
    return count
  }

  const activeFilterCount = getActiveFilterCount()





  return (
    <div className="space-y-4">
      {/* Custom CSS for enhanced calendar */}
      <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />
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
              <SelectItem value="sms">SMS</SelectItem>
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
            <PopoverContent className="w-auto p-0" align="start" onInteractOutside={(e) => e.preventDefault()}>
              <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                {/* Calendar with Date Range Highlighting */}
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="date-range-calendar"
                  ref={(el) => {
                    if (el && (filters.dateRange.from || filters.dateRange.to)) {
                      // Add custom classes to highlight date range
                      setTimeout(() => {
                        const days = el.querySelectorAll('.MuiPickersDay-root')
                        days.forEach((day: any) => {
                          const dayText = day.textContent
                          const dayNumber = parseInt(dayText)
                          
                          // Remove existing range classes
                          day.classList.remove('range-start', 'range-end', 'in-range')
                          
                          if (filters.dateRange.from && filters.dateRange.to) {
                            const startDay = filters.dateRange.from.getDate()
                            const endDay = filters.dateRange.to.getDate()
                            
                            if (dayNumber === startDay) {
                              day.classList.add('range-start')
                            } else if (dayNumber === endDay) {
                              day.classList.add('range-end')
                            } else if (dayNumber > startDay && dayNumber < endDay) {
                              day.classList.add('in-range')
                            }
                          } else if (filters.dateRange.from) {
                            const startDay = filters.dateRange.from.getDate()
                            if (dayNumber === startDay) {
                              day.classList.add('range-start')
                            }
                          }
                        })
                      }, 100)
                    }
                  }}
                >
                  <Calendar
                    value={filters.dateRange.from || null}
                    onChange={(newValue) => {
                      if (!filters.dateRange.from) {
                        // First click - set start date, keep calendar open
                        updateFilter('dateRange', {
                          from: newValue,
                          to: undefined
                        })
                      } else if (!filters.dateRange.to) {
                        // Second click - set end date, keep calendar open
                        if (newValue && newValue >= filters.dateRange.from) {
                          updateFilter('dateRange', {
                            from: filters.dateRange.from,
                            to: newValue
                          })
                          // Don't auto-close, let user click Done
                        } else {
                          // If selected date is before start date, reset and use as new start
                          updateFilter('dateRange', {
                            from: newValue,
                            to: undefined
                          })
                        }
                      } else {
                        // Range already selected - reset and start over
                        updateFilter('dateRange', {
                          from: newValue,
                          to: undefined
                        })
                      }
                    }}
                  />
                </div>

                {/* Range Info */}
                {filters.dateRange.from && filters.dateRange.to && (
                  <div className="text-center text-sm text-gray-600 bg-blue-50 p-2 rounded">
                    {Math.ceil((filters.dateRange.to.getTime() - filters.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} days selected
                  </div>
                )}

                {/* Quick Presets */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
                      updateFilter('dateRange', { from: lastWeek, to: today })
                      setIsDatePickerOpen(false)
                    }}
                  >
                    Last 7d
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
                      updateFilter('dateRange', { from: lastMonth, to: today })
                      setIsDatePickerOpen(false)
                    }}
                  >
                    Last 30d
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date()
                      const lastQuarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000)
                      updateFilter('dateRange', { from: lastQuarter, to: today })
                      setIsDatePickerOpen(false)
                    }}
                  >
                    Last 90d
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      updateFilter('dateRange', { from: undefined, to: undefined })
                    }}
                  >
                    Clear
                  </Button>
                  <div className="text-xs text-gray-500">
                    {filters.dateRange.from && !filters.dateRange.to && "Click another date to complete range"}
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setIsDatePickerOpen(false)}
                  >
                    Done
                  </Button>
                </div>
              </div>
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

        {/* View Controls */}
        <div className="flex items-center">
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