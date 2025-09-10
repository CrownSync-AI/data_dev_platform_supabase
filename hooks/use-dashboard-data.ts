'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

interface DashboardStats {
  totalUsers: number
  totalCampaigns: number
  activeCampaigns: number
  totalRevenue: number
  revenueGrowth: string
  userGrowth: string
  campaignGrowth: string
}

interface RecentUser {
  name: string
  email: string
  created_at: string
  user_type: string
}

interface Campaign {
  id: string
  name: string
  status: string
  budget_allocated: number
  created_at: string
  start_date: string
  end_date: string
}

interface DashboardData {
  stats: DashboardStats
  recentUsers: RecentUser[]
  allUsers: RecentUser[]
  campaigns: Campaign[]
  loading: boolean
  error: string | null
}

export function useDashboardData(): DashboardData {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalUsers: 0,
      totalCampaigns: 0,
      activeCampaigns: 0,
      totalRevenue: 0,
      revenueGrowth: '+0%',
      userGrowth: '+0%',
      campaignGrowth: '+0%'
    },
    recentUsers: [],
    allUsers: [],
    campaigns: [],
    loading: true,
    error: null
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Fetch users data
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) throw usersError

        // Fetch campaigns data
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*')
          .order('created_at', { ascending: false })

        if (campaignsError) throw campaignsError

        // Calculate stats
        const totalUsers = users?.length || 0
        const totalCampaigns = campaigns?.length || 0
        const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0
        const totalRevenue = campaigns?.reduce((sum, c) => sum + (c.budget_allocated || 0), 0) || 0

        // Get recent users (last 5)
        const recentUsers = users?.slice(0, 5) || []

        // Calculate growth percentages (mock data for now)
        const userGrowth = totalUsers > 10 ? '+12%' : '+5%'
        const campaignGrowth = activeCampaigns > 2 ? '+8%' : '+3%'
        const revenueGrowth = totalRevenue > 100000 ? '+15%' : '+7%'

        setData({
          stats: {
            totalUsers,
            totalCampaigns,
            activeCampaigns,
            totalRevenue,
            revenueGrowth,
            userGrowth,
            campaignGrowth
          },
          recentUsers,
          allUsers: users || [],
          campaigns: campaigns || [],
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch data'
        }))
      }
    }

    fetchDashboardData()

    // Set up real-time subscriptions
    const usersSubscription = supabase
      .channel('users-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, () => {
        fetchDashboardData()
      })
      .subscribe()

    const campaignsSubscription = supabase
      .channel('campaigns-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'campaigns'
      }, () => {
        fetchDashboardData()
      })
      .subscribe()

    return () => {
      usersSubscription.unsubscribe()
      campaignsSubscription.unsubscribe()
    }
  }, [supabase])

  return data
}