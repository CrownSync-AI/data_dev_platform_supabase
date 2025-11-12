import { NextRequest, NextResponse } from 'next/server'
import { socialDataSyncService } from '@/lib/services/socialDataSyncService'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, accountIds, platforms: _platforms, forceSync: _forceSync } = body

    let result

    switch (action) {
      case 'manual':
        // Manual sync for specific accounts
        if (!accountIds || accountIds.length === 0) {
          return NextResponse.json(
            { error: 'accountIds required for manual sync' },
            { status: 400 }
          )
        }
        result = await socialDataSyncService.triggerManualSync(accountIds)
        break

      case 'scheduled':
        // Scheduled sync (all accounts)
        result = await socialDataSyncService.scheduledSync()
        break

      case 'test':
        // Test sync for single account
        if (!accountIds || accountIds.length !== 1) {
          return NextResponse.json(
            { error: 'Single accountId required for test sync' },
            { status: 400 }
          )
        }
        result = await socialDataSyncService.testSync(accountIds[0])
        break

      case 'cleanup':
        // Clean up old data
        const cleanupResult = await socialDataSyncService.cleanupOldData()
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${cleanupResult.deletedRecords} old records`
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: manual, scheduled, test, or cleanup' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: result.success,
      data: result,
      message: result.success 
        ? `Sync completed successfully. Processed ${result.accountsProcessed} accounts.`
        : `Sync completed with errors. Check the errors array for details.`
    })

  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { 
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(_request: NextRequest) {
  try {
    // Get sync status
    const status = await socialDataSyncService.getSyncStatus()

    return NextResponse.json({
      success: true,
      data: status
    })

  } catch (error) {
    console.error('Sync status API error:', error)
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}