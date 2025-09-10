import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Fetch campaigns from the new simplified database structure
    const { data: campaigns, error } = await supabase
      .from('campaign_performance_summary')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
    }

    return NextResponse.json({ 
      campaigns: campaigns || [],
      total_count: campaigns?.length || 0 
    })
  } catch (error) {
    console.error('Campaigns API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 