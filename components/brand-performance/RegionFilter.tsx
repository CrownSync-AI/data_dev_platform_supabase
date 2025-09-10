'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import type { RegionFilterProps } from '@/lib/types/social-media';

const regions = [
  { value: 'all', label: 'All Regions' },
  { value: 'East', label: 'East' },
  { value: 'Central', label: 'Central' },
  { value: 'West', label: 'West' }
];

export function RegionFilter({
  selectedRegion,
  onFilterChange
}: RegionFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedRegion} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select region" />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}