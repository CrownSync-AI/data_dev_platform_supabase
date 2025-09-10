// Social Media Data Synchronization Service
// Handles scheduled and manual data sync between Ayrshare API and Supabase

import { createClient } from '@/lib/supabase'
import { ayrshareService, SocialDataTransformer } from './ayrshareService'
import { SocialAccount, AccountAnalytics, SocialAnalytics, AudienceDemographics } from '@/lib/types/social-media'

interface SyncResult {
  success: boolean
  accountsProcessed: number
  postsProcessed: number
  errors: string[]
  lastSyncTime: string
}

interface SyncOptions {
  accountIds?: string[]
  platforms?: string[]
  forceSync?: boolean
  syncPosts?: boolean
  syncDemographics?: boolean
}

export class SocialDataSyncService {
  private supabase = createClient()

  /**
   * Sync all social media data
   */
  async syncAllData(options: SyncOptions = {}): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      accountsProcessed: 0,
      postsProcessed: 0,
      errors: [],
      lastSyncTime: new Date().toISOString()
    }

    try {
      // Get accounts to sync
      const accounts = await this.getAccountsToSync(options)
      
      console.log(`Starting sync for ${accounts.length} social accounts`)

      // Process each account
      for (const account of accounts) {
        try {
          await this.syncAccountData(account, options)
          result.accountsProcessed++
          
          // Update last sync time
          await this.updateLastSyncTime(account.id)
          
        } catch (error) {
          const errorMsg = `Failed to sync account ${account.id}: ${error}`
          console.error(errorMsg)
          result.errors.push(errorMsg)
          result.success = false
        }
      }

      console.log(`Sync completed. Processed ${result.accountsProcessed} accounts with ${result.errors.length} errors`)

    } catch (error) {
      const errorMsg = `Sync process failed: ${error}`
      console.error(errorMsg)
      result.errors.push(errorMsg)
      result.success = false
    }

    return result
  }

  /**
   * Sync data for a single account
   */
  async syncAccountData(account: SocialAccount, options: SyncOptions = {}): Promise<void> {
    if (!account.ayrshare_profile_key) {
      throw new Error(`No Ayrshare profile key for account ${account.id}`)
    }

    console.log(`Syncing data for account: ${account.account_name} (${account.platform})`)

    try {
      // Sync account-level analytics
      const accountAnalytics = await ayrshareService.syncAccountData(account)
      await this.saveAccountAnalytics(accountAnalytics)

      // Sync audience demographics if requested
      if (options.syncDemographics !== false) {
        const demographics = await ayrshareService.syncAudienceDemographics(account)
        await this.saveAudienceDemographics(demographics)
      }

      // Sync post analytics if requested
      if (options.syncPosts !== false) {
        await this.syncAccountPosts(account)
      }

    } catch (error) {
      console.error(`Error syncing account ${account.id}:`, error)
      throw error
    }
  }

  /**
   * Sync posts for an account
   */
  private async syncAccountPosts(account: SocialAccount): Promise<void> {
    // Get recent posts that need analytics sync
    const { data: posts, error } = await this.supabase
      .from('social_posts')
      .select('*')
      .eq('account_id', account.id)
      .eq('status', 'published')
      .not('ayrshare_post_id', 'is', null)
      .gte('published_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

    if (error) {
      throw new Error(`Failed to fetch posts for account ${account.id}: ${error.message}`)
    }

    if (!posts || posts.length === 0) {
      console.log(`No posts to sync for account ${account.id}`)
      return
    }

    console.log(`Syncing ${posts.length} posts for account ${account.id}`)

    // Process each post
    for (const post of posts) {
      try {
        if (post.ayrshare_post_id) {
          const postAnalytics = await ayrshareService.syncPostAnalytics(
            post.ayrshare_post_id,
            post.id,
            account.id,
            account.platform
          )
          
          await this.savePostAnalytics(postAnalytics)
        }
      } catch (error) {
        console.error(`Error syncing post ${post.id}:`, error)
        // Continue with other posts even if one fails
      }
    }
  }

  /**
   * Get accounts that need syncing
   */
  private async getAccountsToSync(options: SyncOptions): Promise<SocialAccount[]> {
    let query = this.supabase
      .from('social_accounts')
      .select('*')
      .eq('is_active', true)

    // Apply filters
    if (options.accountIds && options.accountIds.length > 0) {
      query = query.in('id', options.accountIds)
    }

    if (options.platforms && options.platforms.length > 0) {
      query = query.in('platform', options.platforms)
    }

    // Only sync accounts that haven't been synced recently (unless forced)
    if (!options.forceSync) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      query = query.or(`last_sync_at.is.null,last_sync_at.lt.${oneHourAgo}`)
    }

    const { data: accounts, error } = await query

    if (error) {
      throw new Error(`Failed to fetch accounts: ${error.message}`)
    }

    return accounts || []
  }

  /**
   * Save account analytics to database
   */
  private async saveAccountAnalytics(analytics: AccountAnalytics): Promise<void> {
    const { error } = await this.supabase
      .from('account_analytics')
      .upsert(analytics, {
        onConflict: 'account_id,analytics_date'
      })

    if (error) {
      throw new Error(`Failed to save account analytics: ${error.message}`)
    }
  }

  /**
   * Save post analytics to database
   */
  private async savePostAnalytics(analytics: SocialAnalytics): Promise<void> {
    const { error } = await this.supabase
      .from('social_analytics')
      .upsert(analytics, {
        onConflict: 'post_id,analytics_date'
      })

    if (error) {
      throw new Error(`Failed to save post analytics: ${error.message}`)
    }
  }

  /**
   * Save audience demographics to database
   */
  private async saveAudienceDemographics(demographics: AudienceDemographics): Promise<void> {
    const { error } = await this.supabase
      .from('audience_demographics')
      .upsert(demographics, {
        onConflict: 'account_id,platform,analytics_date'
      })

    if (error) {
      throw new Error(`Failed to save audience demographics: ${error.message}`)
    }
  }

  /**
   * Update last sync time for an account
   */
  private async updateLastSyncTime(accountId: string): Promise<void> {
    const { error } = await this.supabase
      .from('social_accounts')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', accountId)

    if (error) {
      console.error(`Failed to update last sync time for account ${accountId}:`, error)
    }
  }

  /**
   * Get sync status for all accounts
   */
  async getSyncStatus(): Promise<{
    totalAccounts: number
    activeAccounts: number
    recentlySynced: number
    needsSync: number
    lastSyncTimes: { accountId: string; lastSync: string | null; platform: string }[]
  }> {
    const { data: accounts, error } = await this.supabase
      .from('social_accounts')
      .select('id, platform, last_sync_at, is_active')

    if (error) {
      throw new Error(`Failed to get sync status: ${error.message}`)
    }

    const totalAccounts = accounts?.length || 0
    const activeAccounts = accounts?.filter(a => a.is_active).length || 0
    
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentlySynced = accounts?.filter(a => 
      a.last_sync_at && new Date(a.last_sync_at) > oneHourAgo
    ).length || 0
    
    const needsSync = activeAccounts - recentlySynced

    const lastSyncTimes = accounts?.map(a => ({
      accountId: a.id,
      lastSync: a.last_sync_at,
      platform: a.platform
    })) || []

    return {
      totalAccounts,
      activeAccounts,
      recentlySynced,
      needsSync,
      lastSyncTimes
    }
  }

  /**
   * Manual sync trigger for specific accounts
   */
  async triggerManualSync(accountIds: string[]): Promise<SyncResult> {
    return this.syncAllData({
      accountIds,
      forceSync: true,
      syncPosts: true,
      syncDemographics: true
    })
  }

  /**
   * Scheduled sync (called by cron job or webhook)
   */
  async scheduledSync(): Promise<SyncResult> {
    return this.syncAllData({
      forceSync: false,
      syncPosts: true,
      syncDemographics: false // Only sync demographics weekly
    })
  }

  /**
   * Test sync for a single account (development/testing)
   */
  async testSync(accountId: string): Promise<SyncResult> {
    try {
      // Test Ayrshare connection first
      const connectionTest = await ayrshareService.testConnection()
      if (!connectionTest) {
        throw new Error('Ayrshare API connection failed')
      }

      return this.syncAllData({
        accountIds: [accountId],
        forceSync: true,
        syncPosts: false, // Skip posts for quick test
        syncDemographics: false
      })

    } catch (error) {
      return {
        success: false,
        accountsProcessed: 0,
        postsProcessed: 0,
        errors: [`Test sync failed: ${error}`],
        lastSyncTime: new Date().toISOString()
      }
    }
  }

  /**
   * Clean up old analytics data (keep last 90 days)
   */
  async cleanupOldData(): Promise<{ deletedRecords: number }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90)
    const cutoffDateStr = cutoffDate.toISOString().split('T')[0]

    const tables = ['social_analytics', 'account_analytics', 'audience_demographics', 'hashtag_performance']
    let totalDeleted = 0

    for (const table of tables) {
      const { count, error } = await this.supabase
        .from(table)
        .delete()
        .lt('analytics_date', cutoffDateStr)

      if (error) {
        console.error(`Error cleaning up ${table}:`, error)
      } else {
        totalDeleted += count || 0
        console.log(`Cleaned up ${count} records from ${table}`)
      }
    }

    return { deletedRecords: totalDeleted }
  }
}

// Export singleton instance
export const socialDataSyncService = new SocialDataSyncService()