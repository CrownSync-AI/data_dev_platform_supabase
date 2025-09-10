'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RegionFilterProps {
  selectedRegion: string;
  onFilterChange: (region: string) => void;
}

const regions = [
  { label: 'All Regions', value: 'all' },
  { label: 'East', value: 'east' },
  { label: 'Central', value: 'central' },
  { label: 'West', value: 'west' }
];

export function RegionFilter({ selectedRegion, onFilterChange }: RegionFilterProps) {
  const handleRegionChange = (value: string) => {
    onFilterChange(value);
  };

  return (
    <Select value={selectedRegion} onValueChange={handleRegionChange}>
      <SelectTrigger className="w-[150px]">
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
  );
}