'use client'

import { useState, useEffect } from 'react'

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

// Fake data for demo purposes
const FAKE_USERS: RecentUser[] = [
  { name: 'John Doe', email: 'john@example.com', created_at: '2025-01-15T10:00:00Z', user_type: 'Retailer' },
  { name: 'Jane Smith', email: 'jane@example.com', created_at: '2025-01-14T10:00:00Z', user_type: 'Admin' },
  { name: 'Bob Johnson', email: 'bob@example.com', created_at: '2025-01-13T10:00:00Z', user_type: 'Retailer' },
  { name: 'Alice Williams', email: 'alice@example.com', created_at: '2025-01-12T10:00:00Z', user_type: 'Retailer' },
  { name: 'Charlie Brown', email: 'charlie@example.com', created_at: '2025-01-11T10:00:00Z', user_type: 'Retailer' },
  { name: 'Diana Prince', email: 'diana@example.com', created_at: '2025-01-10T10:00:00Z', user_type: 'Admin' },
  { name: 'Edward Norton', email: 'edward@example.com', created_at: '2025-01-09T10:00:00Z', user_type: 'Retailer' },
  { name: 'Fiona Apple', email: 'fiona@example.com', created_at: '2025-01-08T10:00:00Z', user_type: 'Retailer' },
]

const FAKE_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'Spring Collection 2025', status: 'active', budget_allocated: 50000, created_at: '2025-01-01T10:00:00Z', start_date: '2025-02-01', end_date: '2025-04-30' },
  { id: '2', name: 'Summer Sale Campaign', status: 'active', budget_allocated: 75000, created_at: '2025-01-05T10:00:00Z', start_date: '2025-05-01', end_date: '2025-07-31' },
  { id: '3', name: 'Holiday Special', status: 'active', budget_allocated: 100000, created_at: '2024-12-01T10:00:00Z', start_date: '2024-12-15', end_date: '2025-01-15' },
  { id: '4', name: 'New Year Promotion', status: 'completed', budget_allocated: 30000, created_at: '2024-11-15T10:00:00Z', start_date: '2024-12-25', end_date: '2025-01-05' },
  { id: '5', name: 'Back to School', status: 'draft', budget_allocated: 45000, created_at: '2025-01-10T10:00:00Z', start_date: '2025-08-01', end_date: '2025-09-15' },
]

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

  useEffect(() => {
    // Simulate API call delay
    const fetchDashboardData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }))

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use fake data
        const users = FAKE_USERS
        const campaigns = FAKE_CAMPAIGNS

        // Calculate stats
        const totalUsers = users.length
        const totalCampaigns = campaigns.length
        const activeCampaigns = campaigns.filter(c => c.status === 'active').length
        const totalRevenue = campaigns.reduce((sum, c) => sum + c.budget_allocated, 0)

        // Get recent users (last 5)
        const recentUsers = users.slice(0, 5)

        // Calculate growth percentages
        const userGrowth = '+12%'
        const campaignGrowth = '+8%'
        const revenueGrowth = '+15%'

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
          allUsers: users,
          campaigns: campaigns,
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
  }, [])

  return data
}