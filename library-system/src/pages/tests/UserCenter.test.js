// src/pages/tests/UserCenter.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import UserCenter from '../UserCenter.jsx';
import apiClient from '../../api/client';
import { message, Modal } from 'antd';

jest.mock('../../api/client');

const mockUser = {
  id: 1,
  username: 'John Doe',
  role: 'Regular User',
  avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
  createdAt: new Date().toISOString(),
};

const mockBorrows = [
  {
    id: 1,
    book: { id: 101, title: 'Book One', author: 'Author One', isbn: '111' },
    borrowDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString(), // future date
    status: 'BORROWING',
  },
  {
    id: 2,
    book: { id: 102, title: 'Book Two', author: 'Author Two', isbn: '222' },
    borrowDate: new Date().toISOString(),
    dueDate: new Date(Date.now() - 86400000).toISOString(), // past date
    status: 'BORROWING',
  },
];

describe('UserCenter Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('simulates book return', async () => {
    const messageSuccessSpy = jest.spyOn(message, 'success');

    // Mock API responses.
    apiClient.get.mockImplementation((url) => {
      if (url === '/users/me') {
        return Promise.resolve(mockUser);
      }
      if (url === '/borrow') {
        return Promise.resolve(mockBorrows);
      }
    });
    apiClient.post.mockResolvedValue({ data: {} });

    // Override Modal.confirm to automatically trigger the onOk callback.
    jest.spyOn(Modal, 'confirm').mockImplementation(({ onOk }) => {
      onOk();
    });

    render(<UserCenter />);

    // Wait until the first book ("Book One") appears.
    await waitFor(() => {
      expect(screen.getByText(/book one/i)).toBeInTheDocument();
    });

    // Use getAllByRole to find all "Return" buttons and click the first one.
    const returnButtons = screen.getAllByRole('button', { name: /return/i });
    fireEvent.click(returnButtons[0]);

    // Verify that the success message is called.
    await waitFor(() => {
      expect(messageSuccessSpy).toHaveBeenCalledWith('Book returned successfully');
    });
  });
});
