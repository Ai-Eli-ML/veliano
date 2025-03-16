import { render, screen, fireEvent } from '@testing-library/react'
import { SearchDialog } from '@/components/search/search-dialog'

// Mock the SearchResults component
jest.mock('@/components/search/search-results', () => ({
  SearchResults: () => <div data-testid="search-results">Search Results</div>
}))

describe('SearchDialog', () => {
  const mockOnOpenChange = jest.fn()

  beforeEach(() => {
    mockOnOpenChange.mockClear()
  })

  it('renders correctly when open', () => {
    render(<SearchDialog open={true} onOpenChange={mockOnOpenChange} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<SearchDialog open={false} onOpenChange={mockOnOpenChange} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onOpenChange when dialog is closed', () => {
    render(<SearchDialog open={true} onOpenChange={mockOnOpenChange} />)
    const dialog = screen.getByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(mockOnOpenChange).toHaveBeenCalledWith(false)
  })

  it('shows search results when query is entered', () => {
    render(<SearchDialog open={true} onOpenChange={mockOnOpenChange} />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })
}) 