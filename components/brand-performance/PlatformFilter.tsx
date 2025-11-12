'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Share2, Linkedin, Instagram, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlatformFilterProps } from '@/lib/types/social-media';

const platforms = [
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'bg-blue-500' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'bg-pink-500' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { id: 'google_business', label: 'Google Business', icon: Share2, color: 'bg-green-500' }
];

export function PlatformFilter({
  selectedPlatforms,
  onFilterChange
}: PlatformFilterProps) {
  const [open, setOpen] = useState(false);

  const handlePlatformToggle = (platformId: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(p => p !== platformId)
      : [...selectedPlatforms, platformId];
    
    onFilterChange(updatedPlatforms);
  };

  const clearAll = () => {
    onFilterChange([]);
  };

  const selectAll = () => {
    onFilterChange(platforms.map(p => p.id));
  };

  return (
    <div className="flex items-center gap-2">
      <Share2 className="h-4 w-4 text-muted-foreground" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start">
            Platforms
            {selectedPlatforms.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {selectedPlatforms.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Select Platforms</h4>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const isSelected = selectedPlatforms.includes(platform.id);
                
                return (
                  <div key={platform.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={platform.id}
                      checked={isSelected}
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <div className="flex items-center space-x-2">
                      <div className={cn('w-3 h-3 rounded-full', platform.color)} />
                      <Icon className="h-4 w-4" />
                      <label
                        htmlFor={platform.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {platform.label}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedPlatforms.length > 0 && (
              <div className="pt-2 border-t">
                <div className="flex flex-wrap gap-1">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find(p => p.id === platformId);
                    if (!platform) return null;
                    
                    return (
                      <Badge
                        key={platformId}
                        variant="secondary"
                        className="text-xs"
                      >
                        {platform.label}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}