'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Search, Download, X, Calendar as CalendarIcon, UserPlus } from 'lucide-react'
import { CustomerFilters } from '@/lib/services/crmService'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface CustomerFiltersBarProps {
  filters: CustomerFilters
  onFiltersChange: (filters: CustomerFilters) => void
  onExportData: () => void
  onAddCustomer: () => void
  totalCount: number
  loading: boolean
}

export default function CustomerFiltersBar({
  filters,
  onFiltersChange,
  onExportData,
  onAddCustomer,
  totalCount,
  loading
}: CustomerFiltersBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        search: searchTerm
      })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status as CustomerFilters['status']
    })
  }

  const handleSegmentChange = (segment: string) => {
    onFiltersChange({
      ...filters,
      segment: segment as CustomerFilters['segment']
    })
  }

  const handleDateRangeChange = (newDate: Date | null) => {
    if (!newDate) {
      onFiltersChange({
        ...filters,
        dateRange: { from: null, to: null }
      })
      return
    }

    if (!filters.dateRange.from) {
      onFiltersChange({
        ...filters,
        dateRange: { from: newDate, to: null }
      })
    } else if (!filters.dateRange.to) {
      if (newDate < filters.dateRange.from) {
        onFiltersChange({
          ...filters,
          dateRange: { from: newDate, to: filters.dateRange.from }
        })
      } else {
        onFiltersChange({
          ...filters,
          dateRange: { from: filters.dateRange.from, to: newDate }
        })
      }
    } else {
      onFiltersChange({
        ...filters,
        dateRange: { from: newDate, to: null }
      })
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    onFiltersChange({
      search: '',
      status: 'all',
      segment: 'all',
      dateRange: { from: null, to: null }
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status !== 'all') count++
    if (filters.segment !== 'all') count++
    if (filters.dateRange.from || filters.dateRange.to) count++
    return count
  }

  const getSegmentBadgeColor = (segment: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      returning: 'bg-green-100 text-green-800',
      vip: 'bg-purple-100 text-purple-800',
      at_risk: 'bg-yellow-100 text-yellow-800',
      churned: 'bg-red-100 text-red-800'
    }
    return colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const activeFiltersCount = getActiveFiltersCount()

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search customers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        {/* Status Filter */}
        <Select value={filters.status} onValueChange={handleStatusChange} disabled={loading}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Segment Filter */}
        <Select value={filters.segment} onValueChange={handleSegmentChange} disabled={loading}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Segments</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="returning">Returning</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="churned">Churned</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-48 justify-start text-left font-normal",
                !filters.dateRange.from && !filters.dateRange.to && "text-muted-foreground"
              )}
              disabled={loading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              value={filters.dateRange.from || null}
              onChange={(newValue) => {
                handleDateRangeChange(newValue)
                if (newValue) {
                  setDatePickerOpen(false)
                }
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {activeFiltersCount > 0 && (
            <Button variant="outline" size="sm" onClick={clearFilters} disabled={loading}>
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
          
          <Button variant="outline" size="sm" onClick={onExportData} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button size="sm" onClick={onAddCustomer} disabled={loading}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearchTerm('')
                  onFiltersChange({ ...filters, search: '' })
                }}
              />
            </Badge>
          )}
          
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleStatusChange('all')}
              />
            </Badge>
          )}
          
          {filters.segment !== 'all' && (
            <Badge variant="secondary" className={`gap-1 ${getSegmentBadgeColor(filters.segment)}`}>
              Segment: {filters.segment}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleSegmentChange('all')}
              />
            </Badge>
          )}
          
          {(filters.dateRange.from || filters.dateRange.to) && (
            <Badge variant="secondary" className="gap-1">
              Date: {filters.dateRange.from ? format(filters.dateRange.from, "MMM dd") : "Start"} - {filters.dateRange.to ? format(filters.dateRange.to, "MMM dd") : "End"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateRangeChange(null)}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? (
            "Loading customers..."
          ) : (
            `Showing ${totalCount.toLocaleString()} customer${totalCount !== 1 ? 's' : ''}`
          )}
        </div>
      </div>
    </div>
  )
}