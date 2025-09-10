import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import ConversionFunnel from '@/components/brand-performance/ConversionFunnel'

// Mock fetch
global.fetch = jest.fn() as jest.MockedFunction<typeof fetch>

const mockCampaignSummary = {
  summary: {
    total_retailers: 15,
    total_emails_sent: 27037,
    total_emails_delivered: 26515,
    total_emails_opened: 18006,
    total_emails_clicked: 873,
    average_delivery_rate: 98.1,
    average_open_rate: 67.9,
    average_click_rate: 3.3,
    by_region: {
      East: { count: 5, total_sent: 12000, total_clicked: 400 },
      Central: { count: 4, total_sent: 8000, total_clicked: 200 },
      West: { count: 6, total_sent: 7037, total_clicked: 273 }
    },
    by_performance_tier: {
      Top: 3,
      Good: 5,
      Average: 4,
      'Needs Improvement': 3
    }
  }
}

const TEST_CAMPAIGN_ID = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'

describe('ConversionFunnel Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders loading state initially', () => {
    // Mock pending promise
    ;(global.fetch as any).mockReturnValue(new Promise(() => {}))

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    expect(screen.getByText('Loading campaign data...')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('renders funnel data correctly when loaded', async () => {
    // Mock successful API response
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Check funnel stages
    expect(screen.getByText('Emails Sent')).toBeInTheDocument()
    expect(screen.getByText('Delivered')).toBeInTheDocument()
    expect(screen.getByText('Opened')).toBeInTheDocument()
    expect(screen.getByText('Clicked')).toBeInTheDocument()
    expect(screen.getByText('Converted')).toBeInTheDocument()

    // Check funnel values
    expect(screen.getByText('27,037')).toBeInTheDocument()
    expect(screen.getByText('26,515')).toBeInTheDocument()
    expect(screen.getByText('18,006')).toBeInTheDocument()
    expect(screen.getByText('873')).toBeInTheDocument()

    // Check percentages
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('98.1%')).toBeInTheDocument()
    expect(screen.getByText('67.9%')).toBeInTheDocument()
    expect(screen.getByText('3.3%')).toBeInTheDocument()
  })

  it('displays key insights section', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Key Insights')).toBeInTheDocument()
    })

    // Check for insight content
    expect(screen.getByText(/Best Stage:/)).toBeInTheDocument()
    expect(screen.getByText(/Improvement Opportunity:/)).toBeInTheDocument()
    expect(screen.getByText(/Est. ROI:/)).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    ;(global.fetch as any).mockRejectedValue(new Error('API Error'))

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading campaign data/)).toBeInTheDocument()
    })

    // Should show retry button
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('handles 404 response gracefully', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Campaign not found' })
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText(/Campaign not found/)).toBeInTheDocument()
    })
  })

  it('retries data fetch when retry button is clicked', async () => {
    // Mock initial error
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network Error'))
    
    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText(/Error loading campaign data/)).toBeInTheDocument()
    })

    // Mock successful retry
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Verify fetch was called twice
    expect(global.fetch).toHaveBeenCalledTimes(2)
  })

  it('displays correct campaign name in header', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Check for campaign identifier
    expect(screen.getByText(/Marco Bicego New 2025 Campaign/)).toBeInTheDocument()
  })

  it('calculates conversion rate correctly', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Calculate expected conversion rate: 873 / 26515 * 100 ≈ 3.3%
    const conversionRate = (873 / 26515 * 100).toFixed(1)
    expect(screen.getByText(`${conversionRate}%`)).toBeInTheDocument()
  })

  it('shows trend indicators when available', async () => {
    const mockDataWithTrends = {
      ...mockCampaignSummary,
      summary: {
        ...mockCampaignSummary.summary,
        trend_data: {
          delivery_rate_change: 2.1,
          open_rate_change: -1.5,
          click_rate_change: 0.8
        }
      }
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockDataWithTrends
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Look for trend indicators (up/down arrows)
    const trendIcons = screen.getAllByTestId(/trend-/)
    expect(trendIcons.length).toBeGreaterThan(0)
  })

  it('handles empty data gracefully', async () => {
    const emptyData = {
      summary: {
        total_retailers: 0,
        total_emails_sent: 0,
        total_emails_delivered: 0,
        total_emails_opened: 0,
        total_emails_clicked: 0,
        average_delivery_rate: 0,
        average_open_rate: 0,
        average_click_rate: 0,
        by_region: {},
        by_performance_tier: {}
      }
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => emptyData
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Should handle zero values gracefully
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  it('fetches data when campaign ID changes', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    const { rerender } = render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    // Change campaign ID
    const newCampaignId = '12345678-1234-1234-1234-123456789012'
    rerender(<ConversionFunnel campaignId={newCampaignId} />)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })

    // Verify new campaign ID was used in fetch
    expect(global.fetch).toHaveBeenLastCalledWith(
      expect.stringContaining(newCampaignId)
    )
  })

  it('validates funnel stage styling', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Check for funnel stage cards
    const emailsSentCard = screen.getByText('Emails Sent').closest('.border-blue-500')
    const convertedCard = screen.getByText('Converted').closest('.border-green-500')
    
    expect(emailsSentCard).toBeInTheDocument()
    expect(convertedCard).toBeInTheDocument()
  })

  it('displays mobile-responsive layout', async () => {
    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockCampaignSummary
    })

    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Component should still render all stages on mobile
    expect(screen.getByText('Emails Sent')).toBeInTheDocument()
    expect(screen.getByText('Delivered')).toBeInTheDocument()
    expect(screen.getByText('Opened')).toBeInTheDocument()
    expect(screen.getByText('Clicked')).toBeInTheDocument()
    expect(screen.getByText('Converted')).toBeInTheDocument()
  })

  it('uses fallback data when API returns partial data', async () => {
    const partialData = {
      summary: {
        total_retailers: 15,
        total_emails_sent: 27037,
        total_emails_delivered: 26515,
        // Missing some fields
        average_delivery_rate: 98.1,
        by_region: {},
        by_performance_tier: {}
      }
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => partialData
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Should handle missing fields with defaults
    expect(screen.getByText('27,037')).toBeInTheDocument()
    expect(screen.getByText('26,515')).toBeInTheDocument()
  })

  it('formats large numbers correctly', async () => {
    const largeNumberData = {
      summary: {
        total_retailers: 100,
        total_emails_sent: 1234567,
        total_emails_delivered: 1200000,
        total_emails_opened: 800000,
        total_emails_clicked: 50000,
        average_delivery_rate: 97.2,
        average_open_rate: 66.7,
        average_click_rate: 4.2,
        by_region: {},
        by_performance_tier: {}
      }
    }

    ;(global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => largeNumberData
    })

    render(<ConversionFunnel campaignId={TEST_CAMPAIGN_ID} />)

    await waitFor(() => {
      expect(screen.getByText('Campaign Conversion Funnel')).toBeInTheDocument()
    })

    // Check number formatting with commas
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
    expect(screen.getByText('1,200,000')).toBeInTheDocument()
    expect(screen.getByText('800,000')).toBeInTheDocument()
    expect(screen.getByText('50,000')).toBeInTheDocument()
  })
}) 