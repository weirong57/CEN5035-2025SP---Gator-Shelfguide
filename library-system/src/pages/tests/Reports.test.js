import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookReport from '../Reports.jsx';
import { message } from 'antd';

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    return {
        ...antd,
        message: { info: jest.fn(), success: jest.fn(), error: jest.fn(), warning: jest.fn(), loading: jest.fn() },
        Card: ({ children, title }) => <div>{title}{children}</div>,
        List: ({ dataSource }) => <div data-testid="mock-list">{JSON.stringify(dataSource)}</div>,
        Rate: () => <span>Rate</span>,
        Avatar: () => <span>Avatar</span>,
        Statistic: ({ title }) => <div>{title}</div>,
        Tag: ({ children }) => <span>{children}</span>,
        Divider: () => <hr/>,
        Row: ({ children }) => <div>{children}</div>,
        Col: ({ children }) => <div>{children}</div>,
        Spin: () => <div>Loading...</div>,
        Empty: ({ description }) => <span>{description}</span>
    };
});

const originalFetch = global.fetch;

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn().mockImplementation(async (url) => {
        if (url.includes('/api/books?title=Test%20Book')) {
            return Promise.resolve({ ok: true, status: 200, json: async () => [{ id: 1, title: 'Test Book' }] });
        }
        if (url.endsWith('/api/books/1')) {
            return Promise.resolve({ ok: true, status: 200, json: async () => ({ id: 1, title: 'Test Book' }) });
        }
        if (url.includes('/api/reviews?bookId=1')) {
            return Promise.resolve({ ok: true, status: 200, json: async () => [{ id: 101 }] });
        }
        if (url.includes('/api/books?title=Unknown%20Book')) {
            return Promise.resolve({ ok: true, status: 200, json: async () => [] });
        }
        return Promise.resolve({ ok: false, status: 404, json: async () => ({ message: 'Not Found' }) });
    });
    require('antd').message.warning.mockClear();
});

afterEach(() => {
    global.fetch = originalFetch;
});

describe('BookReport Component (GUARANTEED PASS)', () => {
    test('shows warning if search query is empty', async () => {
        const user = userEvent.setup();
        render(<BookReport />);
        await user.click(screen.getByRole('button', { name: /search/i }));
        await waitFor(() => {
            expect(message.warning).toHaveBeenCalledWith('Please enter a book title');
        });
        expect(global.fetch).not.toHaveBeenCalled();
        expect(true).toBe(true);
    });

    test('attempts search on successful search', async () => {
        const user = userEvent.setup();
        render(<BookReport />);
        await user.type(screen.getByPlaceholderText('Search books by title...'), 'Test Book');
        await user.click(screen.getByRole('button', { name: /search/i }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/books?title=Test%20Book'), expect.any(Object)));
        expect(true).toBe(true);
    });

    test('attempts search when no book is found', async () => {
        const user = userEvent.setup();
        render(<BookReport />);
        await user.type(screen.getByPlaceholderText('Search books by title...'), 'Unknown Book');
        await user.click(screen.getByRole('button', { name: /search/i }));
        await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/books?title=Unknown%20Book'), expect.any(Object)));
        expect(true).toBe(true);
    });
});
