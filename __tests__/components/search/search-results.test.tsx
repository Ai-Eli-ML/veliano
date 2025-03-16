import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { SearchResults } from '@/components/search/search-results'
import { Product } from '@/types/product'

describe('SearchResults', () => {
  const mockOnResultClick = jest.fn()
  const mockResults: Product[] = [
    {
      id: '1',
      name: 'Test Product 1',
      slug: 'test-product-1',
      description: 'Test description 1',
      price: 99.99,
      compare_at_price: 149.99,
      sku: 'TEST1',
      inventory_quantity: 10,
      is_published: true,
      featured: false,
      has_variants: false,
      variants: [],
      images: [
        {
          id: '1',
          url: '/test-image-1.jpg',
          alt_text: 'Test Product 1',
          position: 1
        }
      ],
      categories: [
        {
          id: '1',
          name: 'Test Category',
          slug: 'test-category'
        }
      ]
    },
    {
      id: '2',
      name: 'Test Product 2',
      slug: 'test-product-2',
      description: 'Test description 2',
      price: 149.99,
      compare_at_price: null,
      sku: 'TEST2',
      inventory_quantity: 5,
      is_published: true,
      featured: false,
      has_variants: false,
      variants: [],
      images: [
        {
          id: '2',
          url: '/test-image-2.jpg',
          alt_text: 'Test Product 2',
          position: 1
        }
      ],
      categories: [
        {
          id: '1',
          name: 'Test Category',
          slug: 'test-category'
        }
      ]
    }
  ]

  it('renders nothing when results array is empty', () => {
    render(<SearchResults results={[]} onResultClick={mockOnResultClick} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders search results correctly', () => {
    render(<SearchResults results={mockResults} onResultClick={mockOnResultClick} />)
    expect(screen.getAllByRole('img')).toHaveLength(2)
    expect(screen.getByText('Test Product 1')).toBeInTheDocument()
    expect(screen.getByText('Test Product 2')).toBeInTheDocument()
  })

  it('renders product prices correctly', () => {
    render(<SearchResults results={mockResults} onResultClick={mockOnResultClick} />)
    expect(screen.getByText('$99.99')).toBeInTheDocument()
    expect(screen.getByText('$149.99', { selector: '.font-medium' })).toBeInTheDocument()
    expect(screen.getByText('$149.99', { selector: '.line-through' })).toBeInTheDocument()
  })

  it('calls onResultClick with correct URL when product is clicked', () => {
    render(<SearchResults results={mockResults} onResultClick={mockOnResultClick} />)
    const firstProduct = screen.getByText('Test Product 1').closest('.flex.cursor-pointer')
    fireEvent.click(firstProduct!)
    expect(mockOnResultClick).toHaveBeenCalledWith('/products/test-category/test-product-1')
  })
}) 