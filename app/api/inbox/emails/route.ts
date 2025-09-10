import { NextRequest, NextResponse } from 'next/server'
import { DummyDataService } from '@/lib/services/dummyDataService'

export async function GET(_request: NextRequest) {
  try {
    // Generate dummy data for emails using shared customers
    const customers = DummyDataService.getSharedCustomers()
    const { emails, threads } = DummyDataService.generateEmails(customers, 100)

    // Sort threads by last activity (most recent first)
    const sortedThreads = threads.sort((a, b) => 
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    )

    return NextResponse.json({
      threads: sortedThreads,
      emails,
      customers
    })
  } catch (error) {
    console.error('Inbox emails API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    )
  }
} 