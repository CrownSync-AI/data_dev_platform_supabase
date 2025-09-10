'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import type { TimeRangeSelectorProps } from '@/lib/types/social-media';

export function TimeRangeSelector({
  defaultValue,
  options,
  onRangeChange
}: TimeRangeSelectorProps) {
  const [selectedRange, setSelectedRange] = useState(defaultValue);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    onRangeChange(value);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedRange} onValueChange={handleRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}