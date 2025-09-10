import { render, screen, fireEvent } from '@testing-library/react'
import TimeRangeSelector from '@/components/brand-performance/TimeRangeSelector'

describe('TimeRangeSelector', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  test('should render preset options correctly', () => {
    render(<TimeRangeSelector onTimeRangeChange={mockOnChange} />)
    
    // Verify dropdown selector exists
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  test('should call onTimeRangeChange when preset selected', () => {
    render(<TimeRangeSelector onTimeRangeChange={mockOnChange} />)
    
    // Click selector
    fireEvent.click(screen.getByRole('combobox'))
    
    // Select 7 days option
    fireEvent.click(screen.getByText('Past 7 days'))
    
    // Verify callback is called
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Past 7 days',
        value: '7d',
        startDate: expect.any(Date),
        endDate: expect.any(Date)
      })
    )

    // Verify date range is correct (7 days ago to today)
    const call = mockOnChange.mock.calls[0][0]
    const daysDiff = Math.round((call.endDate - call.startDate) / (1000 * 60 * 60 * 24))
    expect(daysDiff).toBe(7)
  })

  test('should handle Past 1 year option correctly', () => {
    render(<TimeRangeSelector onTimeRangeChange={mockOnChange} />)
    
    // The default is now Past 1 year, so click selector and select a different option first
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByText('Past 7 days'))
    
    // Clear the mock and test selecting Past 1 year again
    mockOnChange.mockClear()
    
    // Click selector again
    fireEvent.click(screen.getByRole('combobox'))
    
    // Select 1 year option (get all elements and click the one in the dropdown)
    const yearOptions = screen.getAllByText('Past 1 year')
    fireEvent.click(yearOptions[yearOptions.length - 1]) // Click the last one (in dropdown)
    
    // Verify callback is called
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Past 1 year',
        value: '1y',
        startDate: expect.any(Date),
        endDate: expect.any(Date)
      })
    )

    // Verify date range is correct (365 days ago to today)
    const call = mockOnChange.mock.calls[0][0]
    const daysDiff = Math.round((call.endDate - call.startDate) / (1000 * 60 * 60 * 24))
    expect(daysDiff).toBe(365)
  })

  test('should show custom date pickers when custom selected', () => {
    render(<TimeRangeSelector onTimeRangeChange={mockOnChange} />)
    
    // Click selector
    fireEvent.click(screen.getByRole('combobox'))
    
    // Select custom option
    fireEvent.click(screen.getByText('Custom'))
    
    // Verify date pickers appear
    expect(screen.getByText('Start date')).toBeInTheDocument()
    expect(screen.getByText('End date')).toBeInTheDocument()
  })
}) 