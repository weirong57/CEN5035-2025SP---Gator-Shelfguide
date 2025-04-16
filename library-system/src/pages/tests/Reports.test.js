// src/pages/tests/Reports.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookReport from '../Reports.jsx';
import axios from 'axios';
import { message } from 'antd';

jest.mock('axios');

describe('BookReport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows warning if search query is empty', async () => {
    const warningSpy = jest.spyOn(message, 'warning');
    render(<BookReport />);
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    await waitFor(() => {
      expect(warningSpy).toHaveBeenCalledWith('Please enter a book title');
    });
  });

  test('displays book details and reviews on successful search', async () => {
    // Setup mock responses.
    const mockSearchResponse = { data: [{ id: 1 }] };
    const mockBookResponse = {
      data: {
        id: 1,
        cover: 'cover.jpg',
        title: 'Test Book',
        author: 'Test Author',
        isbn: '123456',
        averageRating: 4,
        available_copies: 5,
        description: 'Test description'
      }
    };
    const mockReviewsResponse = {
      data: [
        {
          id: 1,
          rating: 5,
          // Add the `content` property so that the review passes the filtering
          content: 'Great book',
          // Optionally, also include `comment` since it's used for display
          comment: 'Great book',
          user: { username: 'User1' },
          createdAt: new Date().toISOString()
        }
      ]
    };

    // Chain the axios.get mocks in the order the component calls them.
    axios.get
      .mockResolvedValueOnce(mockSearchResponse)  // for /books?search=...
      .mockResolvedValueOnce(mockBookResponse)    // for /books/1
      .mockResolvedValueOnce(mockReviewsResponse);  // for /reviews?bookId=1

    render(<BookReport />);

    // Simulate entering a search query and clicking Search.
    const searchInput = screen.getByPlaceholderText(/search book by title/i);
    fireEvent.change(searchInput, { target: { value: 'Test Book' } });
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);

    // Wait for the book title to appear.
    await waitFor(() => {
      expect(screen.getByText(/Test Book/i)).toBeInTheDocument();
    });

    // Wait for the review comment "Great book" to appear.
    const reviewElement = await screen.findByText(/Great book/i);
    expect(reviewElement).toBeInTheDocument();
  });
});
