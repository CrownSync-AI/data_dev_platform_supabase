'use client'

import * as React from 'react'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const handleDateSelect = (selectedDate: Date | null) => {
    if (!selectedDate) return

    if (!value.from) {
      // First click - set start date
      onChange({ from: selectedDate, to: undefined })
    } else if (!value.to) {
      // Second click - set end date
      if (selectedDate >= value.from) {
        onChange({ from: value.from, to: selectedDate })
      } else {
        // If selected date is before start date, reset and use as new start
        onChange({ from: selectedDate, to: undefined })
      }
    } else {
      // Range already selected - reset and start over
      onChange({ from: selectedDate, to: undefined })
    }
  }

  const isDateInRange = (date: Date) => {
    if (!value.from) return false
    if (!value.to && !hoverDate) return date.getTime() === value.from.getTime()
    
    const endDate = value.to || hoverDate
    if (!endDate) return date.getTime() === value.from.getTime()
    
    return date >= value.from && date <= endDate
  }

  const isStartDate = (date: Date) => {
    return value.from && date.getTime() === value.from.getTime()
  }

  const isEndDate = (date: Date) => {
    return value.to && date.getTime() === value.to.getTime()
  }

  return (
    <div className={cn("relative", className)}>
      <Calendar
        value={value.from || null}
        onChange={handleDateSelect}
        className="rounded-md border-0"
        // Add custom styling for range visualization
        sx={{
          '& .MuiPickersDay-root': {
            position: 'relative',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
            },
          },
          '& .MuiPickersDay-root.range-start': {
            backgroundColor: 'rgb(59, 130, 246)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgb(37, 99, 235)',
            },
          },
          '& .MuiPickersDay-root.range-end': {
            backgroundColor: 'rgb(59, 130, 246)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgb(37, 99, 235)',
            },
          },
          '& .MuiPickersDay-root.in-range': {
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
            },
          },
        }}
      />
      
      {/* Custom overlay for range visualization */}
      <style jsx>{`
        .date-range-picker .MuiPickersDay-root {
          position: relative;
        }
        
        .date-range-picker .range-start {
          background-color: rgb(59, 130, 246) !important;
          color: white !important;
          border-radius: 6px 0 0 6px !important;
        }
        
        .date-range-picker .range-end {
          background-color: rgb(59, 130, 246) !important;
          color: white !important;
          border-radius: 0 6px 6px 0 !important;
        }
        
        .date-range-picker .in-range {
          background-color: rgba(59, 130, 246, 0.1) !important;
          border-radius: 0 !important;
        }
        
        .date-range-picker .range-start.range-end {
          border-radius: 6px !important;
        }
      `}</style>
    </div>
  )
}