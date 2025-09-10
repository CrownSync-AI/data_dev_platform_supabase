import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    const platform = searchParams.get('platform')
    const userId = searchParams.get('userId')
    const isActive = searchParams.get('isActive')

    // Build the query
    let query = supabase
      .from('social_accounts')
      .select(`
        *,
        users!inner(name, region, user_type)
      `)

    // Apply filters
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }
    
    if (userId) {
      query = query.eq('user_id', userId)
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: accounts, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching social accounts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch social accounts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: accounts
    })

  } catch (error) {
    console.error('Social accounts API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const body = await request.json()
    
    const {
      user_id,
      platform,
      account_handle,
      account_name,
      account_id,
      profile_url,
      ayrshare_profile_key,
      account_metadata = {}
    } = body

    // Validate required fields
    if (!user_id || !platform) {
      return NextResponse.json(
        { error: 'user_id and platform are required' },
        { status: 400 }
      )
    }

    // Check if account already exists
    const { data: existing } = await supabase
      .from('social_accounts')
      .select('id')
      .eq('user_id', user_id)
      .eq('platform', platform)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Social account already exists for this user and platform' },
        { status: 409 }
      )
    }

    // Insert new social account
    const { data: newAccount, error } = await supabase
      .from('social_accounts')
      .insert({
        user_id,
        platform,
        account_handle,
        account_name,
        account_id,
        profile_url,
        ayrshare_profile_key,
        account_metadata,
        is_active: true,
        connected_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating social account:', error)
      return NextResponse.json(
        { error: 'Failed to create social account' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newAccount
    })

  } catch (error) {
    console.error('Social accounts POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}