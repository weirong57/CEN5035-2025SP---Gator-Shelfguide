// BookManagement.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { message, Modal } from 'antd';
import BookManagement from './BookManagement';
import { bookService } from '../api/bookService';

jest.mock('../api/bookService');
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('BookManagement Component', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      isbn: '978-0-13-235088-4',
      available_copies: 3,
    },
    {
      id: '2',
      title: 'JavaScript: The Good Parts',
      author: 'Douglas Crockford',
      isbn: '978-0-596-51774-8',
      available_copies: 0,
    },
  ];

  beforeEach(() => {
    bookService.getBooks.mockResolvedValue({
      data: mockBooks,
      headers: { 'x-total-count': mockBooks.length },
    });
    
    bookService.borrowBook.mockResolvedValue({});
    bookService.returnBook.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loads and displays books on initial render', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Clean Code')).toBeInTheDocument();
      expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  test('performs search when entering query', async () => {
    render(<BookManagement />);
    
    const searchInput = screen.getByPlaceholderText('Search by title/author/ISBN...');
    fireEvent.change(searchInput, { target: { value: 'Clean' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(bookService.getBooks).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Clean',
      }));
    });
  });

  test('handles pagination changes', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTitle('2'));
    });

    expect(bookService.getBooks).toHaveBeenCalledWith(expect.objectContaining({
      _page: 2,
      _limit: 8,
    }));
  });

  test('handles successful book borrowing', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Borrow')[0]);
    });

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(bookService.borrowBook).toHaveBeenCalledWith('1');
      expect(message.success).toHaveBeenCalledWith('Operation successful');
    });
  });

  test('handles successful book returning', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      fireEvent.click(screen.getAllByText('Return')[0]);
    });

    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(bookService.returnBook).toHaveBeenCalledWith('1');
      expect(message.success).toHaveBeenCalledWith('Operation successful');
    });
  });

  test('disables borrow button when no copies available', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      const disabledButton = screen.getByText('Unavailable');
      expect(disabledButton).toBeDisabled();
      expect(disabledButton.closest('button')).toHaveAttribute(
        'disabled'
      );
    });
  });

  test('displays error message when data loading fails', async () => {
    bookService.getBooks.mockRejectedValue(new Error('Network Error'));
    
    render(<BookManagement />);
    
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Network Error');
      expect(screen.getByText('No Data')).toBeInTheDocument();
    });
  });

  test('displays empty state when no books found', async () => {
    bookService.getBooks.mockResolvedValue({
      data: [],
      headers: { 'x-total-count': 0 },
    });
    
    render(<BookManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('No Data')).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute('alt', 'empty');
    });
  });

  test('displays N/A when ISBN is missing', async () => {
    bookService.getBooks.mockResolvedValue({
      data: [{ ...mockBooks[0], isbn: null }],
      headers: { 'x-total-count': 1 },
    });
    
    render(<BookManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  test('displays correct status colors', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      const availableStatus = screen.getByText('Available');
      expect(availableStatus).toHaveStyle('color: #52c41a');
      
      const outOfStockStatus = screen.getByText('Out of Stock');
      expect(outOfStockStatus).toHaveStyle('color: #ff4d4f');
    });
  });
});