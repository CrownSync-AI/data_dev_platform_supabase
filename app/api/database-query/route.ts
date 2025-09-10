import { NextRequest, NextResponse } from 'next/server';
import { DatabaseRAGService } from '@/lib/services/databaseRAGService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, type } = body;

    const databaseRAG = new DatabaseRAGService();
    let result;

    switch (type) {
      case 'schema':
        result = await databaseRAG.getDatabaseSchema();
        return NextResponse.json({
          success: true,
          data: result.map(table => ({
            table: table.table,
            column_count: table.columns.length,
            columns: table.columns.slice(0, 10)
          }))
        });

      case 'campaigns':
        result = await databaseRAG.getCampaignAnalytics(query || {});
        return NextResponse.json(result);

      case 'retailers':
        result = await databaseRAG.getRetailerPerformance(query || {});
        return NextResponse.json(result);

      case 'users':
        result = await databaseRAG.getUserAnalytics(query || {});
        return NextResponse.json(result);

      case 'summary':
        result = await databaseRAG.getSummaryStatistics();
        return NextResponse.json(result);

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid query type. Use: schema, campaigns, retailers, users, or summary'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}