'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import type { SocialAnalyticsFilters } from '@/lib/types/social-media';

interface SocialAnalyticsExportProps {
  filters?: SocialAnalyticsFilters;
}

type ExportFormat = 'csv' | 'pdf' | 'json';
type ExportDataType = 'overview' | 'retailers' | 'content' | 'trends' | 'all';

interface ExportOptions {
  format: ExportFormat;
  dataTypes: ExportDataType[];
  includePlatformBreakdown: boolean;
  includeTimeComparison: boolean;
  includeCharts: boolean;
}

export function SocialAnalyticsExport({ filters }: SocialAnalyticsExportProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    dataTypes: ['overview'],
    includePlatformBreakdown: true,
    includeTimeComparison: false,
    includeCharts: false
  });

  const dataTypeOptions = [
    { id: 'overview', label: 'Overview Metrics', description: 'Total reach, engagement, followers' },
    { id: 'retailers', label: 'Retailer Rankings', description: 'Performance by retailer' },
    { id: 'content', label: 'Top Content', description: 'Best performing posts' },
    { id: 'trends', label: 'Engagement Trends', description: 'Time-series data' },
    { id: 'all', label: 'Complete Dataset', description: 'All available data' }
  ];

  const handleDataTypeChange = (dataType: ExportDataType, checked: boolean) => {
    if (dataType === 'all') {
      setOptions(prev => ({
        ...prev,
        dataTypes: checked ? ['all'] : []
      }));
    } else {
      setOptions(prev => ({
        ...prev,
        dataTypes: checked 
          ? [...prev.dataTypes.filter(t => t !== 'all'), dataType]
          : prev.dataTypes.filter(t => t !== dataType && t !== 'all')
      }));
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      const exportParams = new URLSearchParams();
      exportParams.append('format', options.format);
      exportParams.append('dataTypes', options.dataTypes.join(','));
      exportParams.append('includePlatformBreakdown', options.includePlatformBreakdown.toString());
      exportParams.append('includeTimeComparison', options.includeTimeComparison.toString());
      exportParams.append('includeCharts', options.includeCharts.toString());

      // Add filters
      if (filters?.platform && filters.platform.length > 0) {
        exportParams.append('platforms', filters.platform.join(','));
      }
      if (filters?.region && filters.region !== 'all') {
        exportParams.append('region', filters.region);
      }
      if (filters?.dateRange) {
        exportParams.append('startDate', filters.dateRange.start);
        exportParams.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/export?${exportParams}`);
      if (!response.ok) throw new Error('Export failed');

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `social-analytics-${timestamp}.${options.format}`;
      a.download = filename;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'json':
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Social Analytics Data</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export Format</label>
            <Select 
              value={options.format} 
              onValueChange={(value: ExportFormat) => 
                setOptions(prev => ({ ...prev, format: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    CSV (Excel compatible)
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PDF Report
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    JSON Data
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Data to Include</label>
            <div className="space-y-3">
              {dataTypeOptions.map((dataType) => (
                <div key={dataType.id} className="flex items-start space-x-3">
                  <Checkbox
                    id={dataType.id}
                    checked={options.dataTypes.includes(dataType.id as ExportDataType)}
                    onCheckedChange={(checked) => 
                      handleDataTypeChange(dataType.id as ExportDataType, checked as boolean)
                    }
                  />
                  <div className="space-y-1">
                    <label 
                      htmlFor={dataType.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {dataType.label}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {dataType.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Additional Options</label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="platform-breakdown"
                  checked={options.includePlatformBreakdown}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includePlatformBreakdown: checked as boolean }))
                  }
                />
                <label htmlFor="platform-breakdown" className="text-sm cursor-pointer">
                  Include platform breakdown
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="time-comparison"
                  checked={options.includeTimeComparison}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, includeTimeComparison: checked as boolean }))
                  }
                />
                <label htmlFor="time-comparison" className="text-sm cursor-pointer">
                  Include time period comparison
                </label>
              </div>

              {options.format === 'pdf' && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-charts"
                    checked={options.includeCharts}
                    onCheckedChange={(checked) => 
                      setOptions(prev => ({ ...prev, includeCharts: checked as boolean }))
                    }
                  />
                  <label htmlFor="include-charts" className="text-sm cursor-pointer">
                    Include charts and visualizations
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Current Filters */}
          {(filters?.platform?.length || filters?.region !== 'all') && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Applied Filters</label>
              <div className="flex flex-wrap gap-2">
                {filters?.platform?.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                  </Badge>
                ))}
                {filters?.region && filters.region !== 'all' && (
                  <Badge variant="secondary">
                    {filters.region}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Export Button */}
          <Button 
            onClick={handleExport} 
            disabled={exporting || options.dataTypes.length === 0}
            className="w-full"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                {getFormatIcon(options.format)}
                <span className="ml-2">Export Data</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}