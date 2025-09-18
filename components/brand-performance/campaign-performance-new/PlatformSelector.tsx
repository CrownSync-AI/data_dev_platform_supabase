'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';

interface PlatformSelectorProps {
  selectedPlatforms: Platform[];
  onPlatformChange: (platforms: Platform[]) => void;
}

const platformConfig = {
  all: {
    label: 'All Platforms',
    icon: Globe,
    color: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    activeColor: 'bg-gray-900 text-white'
  },
  facebook: {
    label: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    activeColor: 'bg-blue-600 text-white'
  },
  instagram: {
    label: 'Instagram',
    icon: Instagram,
    color: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
    activeColor: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
  },
  twitter: {
    label: 'X/Twitter',
    icon: Twitter,
    color: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
    activeColor: 'bg-black text-white'
  },
  linkedin: {
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    activeColor: 'bg-blue-700 text-white'
  },
  email: {
    label: 'Email',
    icon: Mail,
    color: 'bg-green-50 text-green-700 hover:bg-green-100',
    activeColor: 'bg-green-600 text-white'
  }
};

export function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const handlePlatformClick = (platform: Platform) => {
    // Only allow single platform selection or "All Platforms"
    onPlatformChange([platform]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Platform Selection</h3>
        <Badge variant="outline" className="text-xs">
          {selectedPlatforms.includes('all') 
            ? 'All Platforms' 
            : `${platformConfig[selectedPlatforms[0] as Platform]?.label || 'Platform'} Selected`
          }
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {Object.entries(platformConfig).map(([key, config]) => {
          const platform = key as Platform;
          const isSelected = selectedPlatforms.includes(platform);
          const Icon = config.icon;
          
          return (
            <Button
              key={platform}
              variant="outline"
              size="sm"
              onClick={() => handlePlatformClick(platform)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200
                ${isSelected 
                  ? `${config.activeColor} border-transparent shadow-md` 
                  : `${config.color} border-gray-200 hover:border-gray-300`
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="font-medium">{config.label}</span>
              {isSelected && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  ✓
                </Badge>
              )}
            </Button>
          );
        })}
      </div>

      {/* Platform Selection Info */}
      <div className="text-sm text-muted-foreground">
        {selectedPlatforms.includes('all') ? (
          <p>Showing data from all social media platforms and email campaigns</p>
        ) : (
          <p>
            Showing data from: {platformConfig[selectedPlatforms[0] as Platform]?.label || 'Selected Platform'}
          </p>
        )}
      </div>
    </div>
  );
}