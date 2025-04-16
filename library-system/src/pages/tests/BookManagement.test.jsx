// src/__tests__/BookManagement.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookManagement from '../pages/BookManagement';
import { bookService } from '../api/bookService';


jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Table: ({ dataSource, columns }) => (
    <table data-testid="mock-table">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.title}</th>
          ))} 
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((record, i) => (
          <tr key={i}>
            {columns.map((col, j) => (
              <td key={j}>
                {col.render 
                  ? col.render(record[col.dataIndex], record) 
                  : record[col.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ), 
}));

jest.mock('../api/bookService', () => ({
  bookService: {
    getBooks: jest.fn(),
  }
}));

describe('BookManagement test', () => {
  const mockBooks = [
    { 
      id: 1, 
      title: 'Test Book 1', 
      author: 'Author 1',
      isbn: '123-456',
      available_copies: 3
    }
  ];

  beforeEach(() => {
    bookService.getBooks.mockResolvedValue({
      data: mockBooks,
      headers: { 'x-total-count': '1' }
    });
  });

  test('loading', async () => {
    render(<BookManagement />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument();
      expect(screen.getByText('Author 1')).toBeInTheDocument();
    });
  });

  test('searching', async () => {
    const user = userEvent.setup();
    render(<BookManagement />);
    
    const searchInput = screen.getByPlaceholderText('Search by title/author/ISBN...');
    await user.type(searchInput, 'test');
    await user.click(screen.getByText('Search'));

    expect(bookService.getBooks).toHaveBeenCalledWith({
      title: encodeURIComponent('test'),
      _page: 1,
      _limit: 8
    });
  });
});