import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const dataTypes = searchParams.get('dataTypes')?.split(',') || ['overview'];
    const includePlatformBreakdown = searchParams.get('includePlatformBreakdown') === 'true';
    const includeTimeComparison = searchParams.get('includeTimeComparison') === 'true';
    const includeCharts = searchParams.get('includeCharts') === 'true';
    
    // Filter parameters
    const platforms = searchParams.get('platforms')?.split(',');
    const region = searchParams.get('region');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const supabase = createClient();

    // Collect data based on requested types
    const exportData: any = {
      metadata: {
        exportDate: new Date().toISOString(),
        format,
        filters: {
          platforms,
          region,
          dateRange: { start: startDate, end: endDate }
        },
        options: {
          includePlatformBreakdown,
          includeTimeComparison,
          includeCharts
        }
      }
    };

    // Fetch overview data
    if (dataTypes.includes('overview') || dataTypes.includes('all')) {
      const overviewResponse = await fetch(
        `${request.nextUrl.origin}/api/social-analytics?${searchParams.toString()}`
      );
      if (overviewResponse.ok) {
        exportData.overview = await overviewResponse.json();
      }
    }

    // Fetch retailer performance data
    if (dataTypes.includes('retailers') || dataTypes.includes('all')) {
      const retailerResponse = await fetch(
        `${request.nextUrl.origin}/api/social-analytics/performance?${searchParams.toString()}`
      );
      if (retailerResponse.ok) {
        const retailerData = await retailerResponse.json();
        exportData.retailers = retailerData.retailers;
      }
    }

    // Fetch top content data
    if (dataTypes.includes('content') || dataTypes.includes('all')) {
      const contentResponse = await fetch(
        `${request.nextUrl.origin}/api/social-analytics/content?${searchParams.toString()}`
      );
      if (contentResponse.ok) {
        exportData.content = await contentResponse.json();
      }
    }

    // Fetch trends data
    if (dataTypes.includes('trends') || dataTypes.includes('all')) {
      const trendsResponse = await fetch(
        `${request.nextUrl.origin}/api/social-analytics/trends?${searchParams.toString()}`
      );
      if (trendsResponse.ok) {
        exportData.trends = await trendsResponse.json();
      }
    }

    // Generate export based on format
    switch (format) {
      case 'csv':
        return generateCSVExport(exportData);
      case 'pdf':
        return generatePDFExport(exportData);
      case 'json':
        return generateJSONExport(exportData);
      default:
        return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    );
  }
}

function generateCSVExport(data: any) {
  let csvContent = '';

  // Add metadata
  csvContent += 'Social Media Analytics Export\n';
  csvContent += `Export Date,${data.metadata.exportDate}\n`;
  csvContent += `Date Range,${data.metadata.filters.dateRange?.start || 'N/A'} to ${data.metadata.filters.dateRange?.end || 'N/A'}\n`;
  csvContent += '\n';

  // Add overview metrics
  if (data.overview) {
    csvContent += 'Overview Metrics\n';
    csvContent += 'Metric,Value\n';
    csvContent += `Total Reach,${data.overview.totalReach || 0}\n`;
    csvContent += `Total Engagement,${data.overview.totalEngagement || 0}\n`;
    csvContent += `Average Engagement Rate,${data.overview.avgEngagementRate || 0}%\n`;
    csvContent += `Total Clicks,${data.overview.totalClicks || 0}\n`;
    csvContent += `New Followers,${data.overview.newFollowers || 0}\n`;
    csvContent += '\n';

    // Platform breakdown
    if (data.overview.platformBreakdown) {
      csvContent += 'Platform Breakdown\n';
      csvContent += 'Platform,Reach,Engagement,Followers\n';
      data.overview.platformBreakdown.forEach((platform: any) => {
        csvContent += `${platform.platform},${platform.reach},${platform.engagement},${platform.followers}\n`;
      });
      csvContent += '\n';
    }
  }

  // Add retailer data
  if (data.retailers) {
    csvContent += 'Retailer Performance\n';
    csvContent += 'Rank,Retailer Name,Region,Total Followers,Avg Engagement Rate,Content Frequency,Performance Grade,Growth Trend\n';
    data.retailers.forEach((retailer: any) => {
      csvContent += `${retailer.rank},${retailer.retailer_name},${retailer.region},${retailer.total_followers},${retailer.avg_engagement_rate}%,${retailer.content_frequency},${retailer.performance_grade},${retailer.growth_trend}%\n`;
    });
    csvContent += '\n';
  }

  // Add top content
  if (data.content) {
    csvContent += 'Top Performing Content\n';
    csvContent += 'Platform,Content Preview,Retailer,Impressions,Reach,Engagement Rate,Total Engagement,Link Clicks\n';
    data.content.forEach((content: any) => {
      const contentPreview = (content.content || 'No preview').replace(/,/g, ';').substring(0, 50);
      csvContent += `${content.platform},"${contentPreview}",${content.retailer_name || content.account_name},${content.impressions},${content.reach},${content.engagement_rate}%,${content.total_engagement},${content.link_clicks}\n`;
    });
  }

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="social-analytics-export.csv"'
    }
  });
}

function generateJSONExport(data: any) {
  return NextResponse.json(data, {
    headers: {
      'Content-Disposition': 'attachment; filename="social-analytics-export.json"'
    }
  });
}

function generatePDFExport(data: any) {
  // For now, return JSON with PDF placeholder
  // In a real implementation, you would use a PDF library like jsPDF or Puppeteer
  const pdfData = {
    message: 'PDF export functionality would be implemented here',
    data: data,
    note: 'This would generate a formatted PDF report with charts and tables'
  };

  return NextResponse.json(pdfData, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="social-analytics-export.json"'
    }
  });
}