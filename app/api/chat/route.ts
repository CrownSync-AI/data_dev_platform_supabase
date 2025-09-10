import { createOpenAI, openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { DatabaseRAGService } from '@/lib/services/databaseRAGService';
import { createClient } from '@supabase/supabase-js';
import { embed } from 'ai';

interface DocumentResult {
  title: string;
  content: string;
  similarity?: number;
}

function formatDataAsTable(data: any[], title: string): string {
  if (!data || data.length === 0) {
    return `**${title}**\n\nNo data available.`;
  }

  const keys = Object.keys(data[0]);
  const header = `| ${keys.join(' | ')} |`;
  const separator = `|${keys.map(() => '---').join('|')}|`;
  const rows = data.map(row => `| ${keys.map(key => row[key] || 'N/A').join(' | ')} |`);

  return `**${title}**\n\n${header}\n${separator}\n${rows.join('\n')}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Chat API received:', body);
    
    // Handle both old and new format
    const messages = body.messages || [];
    
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle data requests by actually fetching data
    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage?.content?.toLowerCase() || '';
    
    let dataContext = '';
    const databaseRAG = new DatabaseRAGService();
    
    // Initialize document search services directly
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const openaiProvider = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    // Check if user is asking for specific data and fetch it
    try {
      // Always try document search first for any user query
      console.log('🔍 Searching documents for query:', userMessage);
      try {
        // Generate embedding for the query
        const { embedding } = await embed({
          model: openaiProvider.embedding('text-embedding-3-small'),
          value: userMessage
        });
        
        // Search for similar documents (try connected-only function first, fallback to all documents)
        let { data: documentResults, error: searchError } = await supabase.rpc('match_documents_connected', {
          query_embedding: embedding,
          match_threshold: 0.1,
          match_count: 3
        });

        // If the connected function doesn't exist, use the original function
        if (searchError && searchError.message.includes('match_documents_connected')) {
          console.log('match_documents_connected function not found, using match_documents...');
          const fallbackResult = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.1,
            match_count: 3
          });
          documentResults = fallbackResult.data;
          searchError = fallbackResult.error;
        }
        
        if (searchError) {
          console.error('💥 Document search error:', searchError.message);
        } else {
          console.log('📄 Document search completed, results:', documentResults?.length || 0);
          
          if (documentResults && documentResults.length > 0) {
            console.log('✅ Found', documentResults.length, 'relevant documents');
            documentResults.forEach((doc: DocumentResult, i: number) => {
              console.log(`  ${i + 1}. ${doc.title} (similarity: ${doc.similarity?.toFixed(3) || 'N/A'})`);
            });
            
            const documentContext = documentResults.map((doc: DocumentResult) => 
              `**Document: ${doc.title}**\n${doc.content.substring(0, 1500)}${doc.content.length > 1500 ? '...' : ''}`
            ).join('\n\n');
            dataContext += `\n\nRELEVANT UPLOADED DOCUMENTS:\n${documentContext}`;
            console.log('📝 Added document context to response');
          } else {
            console.log('❌ No relevant documents found for query');
          }
        }
      } catch (docError) {
        console.error('💥 Document search error:', docError instanceof Error ? docError.message : docError);
        console.error('Stack:', docError instanceof Error ? docError.stack : 'No stack trace');
      }
      
      // Check for database queries
      if (userMessage.includes('retailer') && (userMessage.includes('performance') || userMessage.includes('top') || userMessage.includes('best'))) {
        const retailerData = await databaseRAG.getRetailerPerformance({ limit: 5 });
        if (retailerData.success && retailerData.data) {
          dataContext += `\n\nCURRENT RETAILER PERFORMANCE DATA:\n${formatDataAsTable(retailerData.data, 'Top 5 Retailers by Performance')}`;
        }
      } else if (userMessage.includes('campaign') && (userMessage.includes('performance') || userMessage.includes('analytics') || userMessage.includes('roi'))) {
        const campaignData = await databaseRAG.getCampaignAnalytics({ limit: 5 });
        if (campaignData.success && campaignData.data) {
          dataContext += `\n\nCURRENT CAMPAIGN PERFORMANCE DATA:\n${formatDataAsTable(campaignData.data, 'Campaign Performance Analytics')}`;
        }
      } else if (userMessage.includes('user') && (userMessage.includes('analytics') || userMessage.includes('statistics') || userMessage.includes('stats'))) {
        const userData = await databaseRAG.getUserAnalytics({ limit: 10 });
        if (userData.success && userData.data) {
          dataContext += `\n\nCURRENT USER ANALYTICS DATA:\n${formatDataAsTable(userData.data, 'User Analytics')}`;
        }
      } else if (userMessage.includes('summary') || userMessage.includes('overview') || userMessage.includes('statistics')) {
        const summaryData = await databaseRAG.getSummaryStatistics();
        if (summaryData.success) {
          dataContext += `\n\nPLATFORM SUMMARY STATISTICS:\n${JSON.stringify(summaryData, null, 2)}`;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Continue without data context if there's an error
    }

    const result = streamText({
      model: openai('gpt-5-nano'),
      messages,
      system: `You are a helpful AI assistant for the CrownSync Data Development Platform with LIVE DATABASE AND DOCUMENT ACCESS.
      
      You have access to:
      1. **Real-time database data** from the CrownSync platform
      2. **Uploaded documents** that users have shared with you

      **IMPORTANT INSTRUCTIONS:**
      - When document content is provided in the context below, ALWAYS reference and use it to answer questions
      - If users ask about uploaded documents, files, or content, search through the provided document context
      - Provide specific quotes, summaries, and insights from the uploaded documents
      - If no relevant documents are found, clearly state that no matching documents were found
      
      **Database contains:**
      - **campaigns**: Marketing campaign data with budgets, dates, and status
      - **campaign_performance_summary**: Campaign analytics including ROI, email metrics, and performance tiers
      - **retailer_performance_dashboard**: Retailer rankings, regions, performance grades, and sales data
      - **users**: User information including retailers, brands, admins, regions, and activity status
      - **email_sends**: Email delivery and engagement data
      - **email_campaigns**: Email campaign details and content

      **Document Access:**
      - You can search through uploaded documents (TXT, MD, CSV files)
      - When users ask about documents, you can find and reference relevant content
      - You can summarize, analyze, and answer questions about uploaded documents
      ${dataContext}`,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();

    /* TODO: Re-enable tools once compatibility issues are resolved
      tools: {
        searchDocuments: tool({
          description: 'Search through uploaded documents to find relevant information using vector similarity',
          parameters: z.object({
            query: z.string().describe('The search query to find relevant documents'),
            limit: z.number().optional().default(5).describe('Number of results to return (max 10)')
          }),
          execute: async ({ query, limit = 5 }) => {
            try {
              const results = await documentRAG.searchSimilarDocuments(query, Math.min(limit, 10));
              return {
                success: true,
                found: results.length,
                documents: results.map((doc) => ({
                  title: doc.title,
                  content: doc.content.substring(0, 1500) + (doc.content.length > 1500 ? '...' : ''),
                  file_type: doc.file_type,
                  similarity: Math.round(doc.similarity * 100) / 100,
                  upload_date: doc.upload_date
                }))
              };
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error',
                found: 0,
                documents: []
              };
            }
          }
        }),

        queryCampaigns: tool({
          description: 'Query campaign performance data including ROI, email metrics, and campaign status',
          parameters: z.object({
            campaign_id: z.string().optional().describe('Specific campaign ID to filter by'),
            status: z.enum(['active', 'completed', 'paused', 'draft']).optional().describe('Campaign status filter'),
            limit: z.number().optional().default(10).describe('Maximum number of campaigns to return')
          }),
          execute: async ({ campaign_id, status, limit = 10 }) => {
            try {
              const result = await databaseRAG.getCampaignAnalytics({ 
                campaign_id, 
                status, 
                limit: Math.min(limit, 50) 
              });
              return result;
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        }),

        queryRetailers: tool({
          description: 'Query retailer performance data including rankings, regions, and performance grades',
          parameters: z.object({
            region: z.enum(['East', 'Central', 'West', 'North', 'South']).optional().describe('Geographic region filter'),
            performance_grade: z.enum(['A', 'B', 'C', 'D', 'F']).optional().describe('Performance grade filter'),
            limit: z.number().optional().default(10).describe('Maximum number of retailers to return')
          }),
          execute: async ({ region, performance_grade, limit = 10 }) => {
            try {
              const result = await databaseRAG.getRetailerPerformance({ 
                region, 
                performance_grade, 
                limit: Math.min(limit, 50) 
              });
              return result;
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        }),

        queryUsers: tool({
          description: 'Get user analytics and statistics by type, region, and activity status',
          parameters: z.object({
            user_type: z.enum(['retailer', 'brand', 'admin']).optional().describe('User type filter'),
            region: z.enum(['East', 'Central', 'West', 'North', 'South']).optional().describe('Geographic region filter'),
            is_active: z.boolean().optional().describe('Filter by active status'),
            limit: z.number().optional().default(20).describe('Maximum number of users to return')
          }),
          execute: async ({ user_type, region, is_active, limit = 20 }) => {
            try {
              const result = await databaseRAG.getUserAnalytics({ 
                user_type, 
                region, 
                is_active, 
                limit: Math.min(limit, 100) 
              });
              return result;
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        }),

        queryEmailPerformance: tool({
          description: 'Get detailed email campaign performance including open rates, click rates, and delivery metrics',
          parameters: z.object({
            campaign_id: z.string().optional().describe('Specific campaign ID to filter by'),
            status: z.enum(['sent', 'delivered', 'opened', 'clicked', 'bounced']).optional().describe('Email status filter'),
            region: z.enum(['East', 'Central', 'West', 'North', 'South']).optional().describe('Geographic region filter'),
            limit: z.number().optional().default(20).describe('Maximum number of email records to return')
          }),
          execute: async ({ campaign_id, status, region, limit = 20 }) => {
            try {
              const result = await databaseRAG.getEmailCampaignPerformance({ 
                campaign_id, 
                status, 
                region, 
                limit: Math.min(limit, 100) 
              });
              return result;
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        }),

        getSummaryStatistics: tool({
          description: 'Get overall platform statistics and key performance indicators',
          parameters: z.object({}),
          execute: async () => {
            try {
              const result = await databaseRAG.getSummaryStatistics();
              return result;
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        }),

        getDatabaseSchema: tool({
          description: 'Get information about available database tables and their structure',
          parameters: z.object({}),
          execute: async () => {
            try {
              const schema = await databaseRAG.getDatabaseSchema();
              const availableQueries = databaseRAG.getAvailableQueries();
              
              return { 
                success: true, 
                schema: schema.map(table => ({
                  table: table.table,
                  column_count: table.columns.length,
                  columns: table.columns.slice(0, 10) // Limit columns shown
                })),
                available_queries: availableQueries,
                total_tables: schema.length
              };
            } catch (error) {
              return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              };
            }
          }
        })
      },
    */
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}