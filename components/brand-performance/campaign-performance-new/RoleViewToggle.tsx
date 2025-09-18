'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Store } from 'lucide-react';

type Role = 'brand' | 'retailer';

interface RoleViewToggleProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
}

export function RoleViewToggle({ currentRole, onRoleChange }: RoleViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">View as:</span>
      
      <div className="flex items-center bg-muted rounded-lg p-1">
        <Button
          variant={currentRole === 'brand' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRoleChange('brand')}
          className={`
            flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200
            ${currentRole === 'brand' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'hover:bg-background'
            }
          `}
        >
          <Building2 className="h-4 w-4" />
          <span>Brand</span>
        </Button>
        
        <Button
          variant={currentRole === 'retailer' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onRoleChange('retailer')}
          className={`
            flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200
            ${currentRole === 'retailer' 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'hover:bg-background'
            }
          `}
        >
          <Store className="h-4 w-4" />
          <span>Retailer</span>
        </Button>
      </div>

      <Badge variant="outline" className="text-xs">
        {currentRole === 'brand' ? 'All Retailers' : 'My Performance'}
      </Badge>
    </div>
  );
}