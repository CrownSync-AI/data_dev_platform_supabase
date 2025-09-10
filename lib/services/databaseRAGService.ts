import { createClient } from '@supabase/supabase-js';

export interface DatabaseSchema {
  table: string;
  columns: Array<{
    column_name: string;
    data_type: string;
    is_nullable: string;
  }>;
}

export interface QueryResult {
  success: boolean;
  data?: any[];
  error?: string;
  rowCount?: number;
}

export class DatabaseRAGService {
  private _supabase: ReturnType<typeof createClient> | null = null;

  private get supabase() {
    if (!this._supabase) {
      this._supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
    }
    return this._supabase;
  }

  /**
   * Get database schema information - Simplified version
   */
  async getDatabaseSchema(): Promise<DatabaseSchema[]> {
    try {
      // Return hardcoded schema for known tables since information_schema access is limited
      const knownTables: DatabaseSchema[] = [
        {
          table: 'campaigns',
          columns: [
            { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
            { column_name: 'name', data_type: 'text', is_nullable: 'NO' },
            { column_name: 'status', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'YES' },
            { column_name: 'updated_at', data_type: 'timestamp', is_nullable: 'YES' }
          ]
        },
        {
          table: 'campaign_performance_summary',
          columns: [
            { column_name: 'campaign_id', data_type: 'uuid', is_nullable: 'NO' },
            { column_name: 'total_roi', data_type: 'numeric', is_nullable: 'YES' },
            { column_name: 'total_emails_sent', data_type: 'integer', is_nullable: 'YES' },
            { column_name: 'total_opens', data_type: 'integer', is_nullable: 'YES' },
            { column_name: 'total_clicks', data_type: 'integer', is_nullable: 'YES' },
            { column_name: 'open_rate', data_type: 'numeric', is_nullable: 'YES' },
            { column_name: 'click_rate', data_type: 'numeric', is_nullable: 'YES' }
          ]
        },
        {
          table: 'retailer_performance_dashboard',
          columns: [
            { column_name: 'retailer_id', data_type: 'uuid', is_nullable: 'NO' },
            { column_name: 'retailer_name', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'region', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'performance_grade', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'overall_rank', data_type: 'integer', is_nullable: 'YES' },
            { column_name: 'total_sales', data_type: 'numeric', is_nullable: 'YES' }
          ]
        },
        {
          table: 'users',
          columns: [
            { column_name: 'id', data_type: 'uuid', is_nullable: 'NO' },
            { column_name: 'name', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'user_type', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'region', data_type: 'text', is_nullable: 'YES' },
            { column_name: 'is_active', data_type: 'boolean', is_nullable: 'YES' },
            { column_name: 'created_at', data_type: 'timestamp', is_nullable: 'YES' }
          ]
        }
      ];

      return knownTables;
    } catch (error) {
      console.error('Database schema error:', error);
      throw error;
    }
  }

  /**
   * Get campaign analytics data
   */
  async getCampaignAnalytics(filters: any = {}): Promise<QueryResult> {
    try {
      let query = this.supabase
        .from('campaign_performance_summary')
        .select('*');

      if (filters.campaign_id) {
        query = query.eq('campaign_id', filters.campaign_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Campaign analytics error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: data || [], 
        rowCount: data?.length || 0 
      };
    } catch (error) {
      console.error('Campaign analytics error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get retailer performance data
   */
  async getRetailerPerformance(filters: any = {}): Promise<QueryResult> {
    try {
      let query = this.supabase
        .from('retailer_performance_dashboard')
        .select('*');

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.performance_grade) {
        query = query.eq('performance_grade', filters.performance_grade);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('overall_rank', { ascending: true });

      if (error) {
        console.error('Retailer performance error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: data || [], 
        rowCount: data?.length || 0 
      };
    } catch (error) {
      console.error('Retailer performance error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get user analytics data
   */
  async getUserAnalytics(filters: any = {}): Promise<QueryResult> {
    try {
      let query = this.supabase
        .from('users')
        .select('id, name, user_type, region, created_at, is_active');

      if (filters.user_type) {
        query = query.eq('user_type', filters.user_type);
      }

      if (filters.region) {
        query = query.eq('region', filters.region);
      }

      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('User analytics error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: data || [], 
        rowCount: data?.length || 0 
      };
    } catch (error) {
      console.error('User analytics error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get email campaign performance
   */
  async getEmailCampaignPerformance(filters: any = {}): Promise<QueryResult> {
    try {
      let query = this.supabase
        .from('email_sends')
        .select(`
          *,
          email_campaigns!inner(
            id,
            subject,
            campaign_id,
            campaigns!inner(
              id,
              name,
              status
            )
          ),
          users!inner(
            id,
            name,
            region,
            user_type
          )
        `);

      if (filters.campaign_id) {
        query = query.eq('email_campaigns.campaign_id', filters.campaign_id);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.region) {
        query = query.eq('users.region', filters.region);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query.order('sent_at', { ascending: false });

      if (error) {
        console.error('Email campaign performance error:', error);
        return { success: false, error: error.message };
      }

      return { 
        success: true, 
        data: data || [], 
        rowCount: data?.length || 0 
      };
    } catch (error) {
      console.error('Email campaign performance error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get summary statistics
   */
  async getSummaryStatistics(): Promise<QueryResult> {
    try {
      // Get campaign summary
      const { data: campaignSummary } = await this.supabase
        .from('campaign_performance_summary')
        .select('*')
        .limit(1);

      // Get retailer summary
      const { data: retailerSummary } = await this.supabase
        .from('retailer_performance_summary')
        .select('*')
        .limit(1);

      // Get user counts
      const { data: userCounts } = await this.supabase
        .from('users')
        .select('user_type, region')
        .eq('is_active', true);

      // Process user statistics
      const userStats = {
        total_users: userCounts?.length || 0,
        by_type: {} as Record<string, number>,
        by_region: {} as Record<string, number>
      };

      userCounts?.forEach(user => {
        userStats.by_type[user.user_type] = (userStats.by_type[user.user_type] || 0) + 1;
        if (user.region) {
          userStats.by_region[user.region] = (userStats.by_region[user.region] || 0) + 1;
        }
      });

      const summary = {
        campaigns: campaignSummary?.[0] || null,
        retailers: retailerSummary?.[0] || null,
        users: userStats,
        generated_at: new Date().toISOString()
      };

      return { 
        success: true, 
        data: [summary], 
        rowCount: 1 
      };
    } catch (error) {
      console.error('Summary statistics error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute a custom safe query (SELECT only) - Simplified version
   */
  async executeCustomQuery(queryText: string): Promise<QueryResult> {
    try {
      // Validate query safety
      if (!this.isQuerySafe(queryText)) {
        return { 
          success: false, 
          error: 'Unsafe query detected. Only SELECT queries are allowed.' 
        };
      }

      // For now, provide helpful suggestions instead of direct SQL execution
      // This is safer until we can set up the custom function
      const suggestions = this.getSQLQuerySuggestions(queryText);
      
      return { 
        success: false, 
        error: `Direct SQL execution is not available yet. Try these predefined queries instead: ${suggestions.join(', ')}`,
        data: []
      };
    } catch (error) {
      console.error('Custom query error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get query suggestions based on user intent
   */
  private getSQLQuerySuggestions(queryText: string): string[] {
    const query = queryText.toLowerCase();
    const suggestions: string[] = [];

    if (query.includes('campaign')) {
      suggestions.push('Use getCampaignAnalytics tool');
    }
    if (query.includes('retailer')) {
      suggestions.push('Use getRetailerPerformance tool');
    }
    if (query.includes('user') || query.includes('customer')) {
      suggestions.push('Ask about user analytics');
    }
    if (query.includes('email')) {
      suggestions.push('Ask about email campaign performance');
    }
    if (query.includes('schema') || query.includes('table')) {
      suggestions.push('Use getDatabaseSchema tool');
    }

    return suggestions.length > 0 ? suggestions : ['Ask about campaigns, retailers, users, or email performance'];
  }

  /**
   * Validate query safety (prevent destructive operations)
   */
  private isQuerySafe(query: string): boolean {
    const unsafeKeywords = [
      'DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 
      'CREATE', 'TRUNCATE', 'GRANT', 'REVOKE', 'EXEC',
      'EXECUTE', 'CALL', 'MERGE', 'REPLACE'
    ];
    
    const upperQuery = query.toUpperCase().trim();
    
    // Must start with SELECT
    if (!upperQuery.startsWith('SELECT')) {
      return false;
    }
    
    // Check for unsafe keywords
    return !unsafeKeywords.some(keyword => upperQuery.includes(keyword));
  }

  /**
   * Get available query types and descriptions
   */
  getAvailableQueries(): Array<{ name: string; description: string; example: string }> {
    return [
      {
        name: 'Campaign Analytics',
        description: 'Get campaign performance data including ROI, email metrics, and status',
        example: 'Show me all active campaigns with their performance metrics'
      },
      {
        name: 'Retailer Performance',
        description: 'Analyze retailer performance including rankings, regions, and grades',
        example: 'Who are the top 5 performing retailers in the West region?'
      },
      {
        name: 'User Analytics',
        description: 'Get user statistics by type, region, and activity status',
        example: 'How many active retailers do we have by region?'
      },
      {
        name: 'Email Campaign Performance',
        description: 'Detailed email campaign metrics including open rates and click rates',
        example: 'Show me email performance for the Marco Bicego campaign'
      },
      {
        name: 'Summary Statistics',
        description: 'Overall platform statistics and key performance indicators',
        example: 'Give me a summary of all platform metrics'
      },
      {
        name: 'Database Schema',
        description: 'Information about available tables and their structure',
        example: 'What data tables are available in the database?'
      }
    ];
  }
}