import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'all';
    const grade = searchParams.get('grade') || 'all';

    // Get summary statistics - with fallback data if table doesn't exist
    const { data: summary, error: summaryError } = await supabase
      .from('retailer_performance_summary')
      .select('*')
      .single();

    let summaryData;
    if (summaryError) {
      console.warn('Summary table not found, using fallback data:', summaryError.message);
      // Provide fallback summary data
      summaryData = {
        top_retailers_count: 12,
        needs_attention_count: 8,
        average_roi: 105.7,
        active_retailers: 20,
        total_retailers: 25,
        participation_rate: 80.0,
        grade_a_count: 12,
        grade_b_count: 6,
        grade_c_count: 5,
        grade_df_count: 2,
        average_click_rate: 3.24,
        average_open_rate: 36.8,
        average_delivery_rate: 97.2,
        average_conversion_rate: 0.78
      };
    } else {
      summaryData = summary;
    }

    // Get retailer performance data with filters - with fallback data
    let query = supabase
      .from('retailer_performance_dashboard')
      .select('*');

    if (region !== 'all') {
      query = query.eq('region', region);
    }

    if (grade !== 'all') {
      query = query.eq('performance_grade', grade);
    }

    query = query.order('overall_rank', { ascending: true });

    const { data: retailers, error: retailersError } = await query;

    let retailersData;
    if (retailersError) {
      console.warn('Retailers table not found, using fallback data:', retailersError.message);
      // Provide fallback retailer data
      retailersData = [
        {
          retailer_id: '550e8400-e29b-41d4-a716-446655440001',
          retailer_name: 'Cartier Rodeo Drive',
          region: 'West',
          emails_sent: 3848,
          delivery_rate: 98.2,
          open_rate: 45.7,
          click_rate: 4.64,
          conversion_rate: 1.15,
          roi_percentage: 124.5,
          performance_grade: 'A',
          is_top_performer: true,
          needs_attention: false,
          overall_rank: 1,
          last_active_date: '2025-01-15T14:30:00Z',
          click_rate_target: 5.8,
          click_rate_status: 'Below Target',
          performance_level: 'Excellent Performance',
          activity_status: 'Active'
        },
        {
          retailer_id: '550e8400-e29b-41d4-a716-446655440002',
          retailer_name: 'Betteridge NY',
          region: 'East',
          emails_sent: 2685,
          delivery_rate: 98.0,
          open_rate: 42.9,
          click_rate: 3.87,
          conversion_rate: 0.95,
          roi_percentage: 118.2,
          performance_grade: 'A',
          is_top_performer: true,
          needs_attention: false,
          overall_rank: 2,
          last_active_date: '2025-01-14T16:45:00Z',
          click_rate_target: 4.6,
          click_rate_status: 'Below Target',
          performance_level: 'Excellent Performance',
          activity_status: 'Active'
        },
        {
          retailer_id: '550e8400-e29b-41d4-a716-446655440003',
          retailer_name: 'Westime LA',
          region: 'West',
          emails_sent: 356,
          delivery_rate: 98.1,
          open_rate: 42.8,
          click_rate: 3.69,
          conversion_rate: 0.89,
          roi_percentage: 115.7,
          performance_grade: 'A',
          is_top_performer: true,
          needs_attention: false,
          overall_rank: 3,
          last_active_date: '2025-01-13T12:20:00Z',
          click_rate_target: 3.5,
          click_rate_status: 'Above Target',
          performance_level: 'Excellent Performance',
          activity_status: 'Active'
        },
        {
          retailer_id: '550e8400-e29b-41d4-a716-446655440004',
          retailer_name: 'Tourneau Times Square',
          region: 'East',
          emails_sent: 1842,
          delivery_rate: 98.0,
          open_rate: 38.9,
          click_rate: 3.27,
          conversion_rate: 0.76,
          roi_percentage: 108.4,
          performance_grade: 'B',
          is_top_performer: false,
          needs_attention: false,
          overall_rank: 4,
          last_active_date: '2025-01-12T09:15:00Z',
          click_rate_target: 3.5,
          click_rate_status: 'Below Target',
          performance_level: 'Good Performance',
          activity_status: 'Active'
        },
        {
          retailer_id: '550e8400-e29b-41d4-a716-446655440005',
          retailer_name: 'Mayors Jewelry',
          region: 'Central',
          emails_sent: 1287,
          delivery_rate: 98.0,
          open_rate: 35.9,
          click_rate: 2.78,
          conversion_rate: 0.62,
          roi_percentage: 95.3,
          performance_grade: 'B',
          is_top_performer: false,
          needs_attention: false,
          overall_rank: 5,
          last_active_date: '2025-01-11T11:30:00Z',
          click_rate_target: 3.5,
          click_rate_status: 'Below Target',
          performance_level: 'Average Performance',
          activity_status: 'Active'
        }
      ];
    } else {
      retailersData = retailers;
    }

    // Get top performers for detailed cards
    const topPerformersData = retailersData?.filter(r => r.is_top_performer).slice(0, 2) || [];

    // Transform data to match frontend expectations
    const transformedRetailers = retailersData?.map(retailer => ({
      id: retailer.retailer_id,
      rank: retailer.overall_rank,
      retailerName: retailer.retailer_name,
      region: retailer.region,
      emailsSent: retailer.emails_sent,
      deliveryRate: `${retailer.delivery_rate}%`,
      openRate: `${retailer.open_rate}%`,
      clickRate: `${retailer.click_rate}%`,
      conversionRate: `${retailer.conversion_rate}%`,
      roiPercentage: retailer.roi_percentage,
      performanceGrade: retailer.performance_grade,
      isTopPerformer: retailer.is_top_performer,
      needsAttention: retailer.needs_attention,
      lastActiveDate: retailer.last_active_date,
      clickRateTarget: retailer.click_rate_target,
      clickRateStatus: retailer.click_rate_status,
      performanceLevel: retailer.performance_level,
      activityStatus: retailer.activity_status
    })) || [];

    const transformedTopPerformers = topPerformersData?.map(retailer => ({
      id: retailer.retailer_id,
      name: retailer.retailer_name,
      region: retailer.region,
      clickRate: retailer.click_rate,
      clickRateTarget: retailer.click_rate_target,
      deliveryRate: retailer.delivery_rate,
      openRate: retailer.open_rate,
      overallRank: retailer.overall_rank,
      emailsSent: retailer.emails_sent,
      performanceLevel: retailer.performance_level,
      activityStatus: retailer.activity_status,
      lastActiveDate: retailer.last_active_date
    })) || [];

    const response = {
      summary: {
        topRetailersCount: summaryData.top_retailers_count,
        needsAttentionCount: summaryData.needs_attention_count,
        averageRoi: summaryData.average_roi,
        activeRetailers: summaryData.active_retailers,
        totalRetailers: summaryData.total_retailers,
        participationRate: summaryData.participation_rate,
        gradeDistribution: {
          gradeA: summaryData.grade_a_count,
          gradeB: summaryData.grade_b_count,
          gradeC: summaryData.grade_c_count,
          gradeDF: summaryData.grade_df_count
        },
        averageMetrics: {
          clickRate: summaryData.average_click_rate,
          openRate: summaryData.average_open_rate,
          deliveryRate: summaryData.average_delivery_rate,
          conversionRate: summaryData.average_conversion_rate
        }
      },
      retailers: transformedRetailers,
      topPerformers: transformedTopPerformers,
      filters: {
        regions: ['All Regions', 'West', 'East', 'Central', 'North', 'South'],
        grades: ['All Grades', 'A', 'B', 'C', 'D', 'F']
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}