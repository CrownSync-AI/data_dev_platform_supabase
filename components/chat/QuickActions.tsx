'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, FileText, Database, Mail, LucideIcon } from 'lucide-react';

interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
  message: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'Campaign Performance',
    description: 'Analyze campaign ROI and effectiveness',
    icon: BarChart3,
    message: 'Show me the performance of all active campaigns with their ROI and key metrics'
  },
  {
    label: 'Top Retailers',
    description: 'View best performing retailers',
    icon: TrendingUp,
    message: 'Who are the top 5 performing retailers and what makes them successful?'
  },
  {
    label: 'Database Overview',
    description: 'Explore available data tables',
    icon: Database,
    message: 'What data tables are available in the database and what information do they contain?'
  },
  {
    label: 'Email Analytics',
    description: 'Review email campaign metrics',
    icon: Mail,
    message: 'Show me email campaign performance including open rates and click rates'
  },
  {
    label: 'User Statistics',
    description: 'View user activity and demographics',
    icon: Users,
    message: 'Give me a breakdown of users by type and region with activity statistics'
  },
  {
    label: 'Upload Documents',
    description: 'Add documents for Q&A',
    icon: FileText,
    message: 'How can I upload documents to ask questions about their content?'
  }
];

interface QuickActionsProps {
  onActionClick: (message: string) => void;
}

export function QuickActions({ onActionClick }: QuickActionsProps) {
  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <p className="text-sm text-muted-foreground">
          Get started with these common queries, or ask your own questions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto p-4 text-left justify-start hover:bg-muted/50"
            onClick={() => onActionClick(action.message)}
          >
            <action.icon className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{action.label}</div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}