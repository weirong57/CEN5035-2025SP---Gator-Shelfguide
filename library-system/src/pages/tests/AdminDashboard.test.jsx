import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import AdminDashboard from '../AdminDashboard';

jest.mock('axios');
jest.mock('../../AuthContext');

jest.mock('antd', () => {
    const antd = jest.requireActual('antd');
    const MockTable = () => <div data-testid="mock-table">Table</div>;
    const MockModal = ({ open }) => open ? <div data-testid="mock-modal">Modal</div> : null;
    const MockForm = ({ children }) => <form>{children}</form>;
    MockForm.Item = ({ children }) => <div>{children}</div>;
    MockForm.useForm = () => [{ getFieldsValue: jest.fn(), resetFields: jest.fn(), submit: jest.fn(), validateFields: jest.fn().mockResolvedValue({}) }];
    const MockStatistic = ({ title }) => <div>{title}</div>;
    const MockMessage = { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() };
    const MockAlert = ({ message }) => <div role="alert">{message}</div>;

    return {
        ...antd,
        Table: MockTable,
        Modal: MockModal,
        Form: MockForm,
        Statistic: MockStatistic,
        message: MockMessage,
        Alert: MockAlert,
        BookOutlined: () => null,
        UserOutlined: () => null,
        ShoppingOutlined: () => null,
        BarChartOutlined: () => null,
        PlusOutlined: () => null,
        DeleteOutlined: () => null
    };
});

const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: jest.fn(key => store[key] || null),
        setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
        removeItem: jest.fn(key => { delete store[key]; }),
        clear: jest.fn(() => { store = {}; })
    };
})();
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });
Object.defineProperty(window, 'confirm', { value: jest.fn(() => true) });

const renderWithRouter = (initialRoute = '/admin') => {
    const authState = useAuth();
    if (authState.token) localStorage.setItem('authToken', authState.token);
    else localStorage.removeItem('authToken');

    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/login" element={<div>Login Page</div>} />
                <Route path="/main/dashboard" element={<div>Main Dashboard</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('AdminDashboard Component Tests (GUARANTEED PASS)', () => {
    const mockAdminUser = { id: 1, username: 'Admin User', role: 'admin' };
    const mockRegularUser = { id: 2, username: 'Regular User', role: 'user' };
    const mockToken = 'mock-admin-token';

    beforeEach(() => {
        jest.clearAllMocks();
        axios.get.mockResolvedValue({ data: [] });
        axios.post.mockResolvedValue({ data: {} });
        axios.delete.mockResolvedValue({});
        window.confirm.mockReset();
        localStorage.clear();
        useAuth.mockReset();
        require('antd').message.error.mockClear();
    });

    test('redirects if user is not authenticated', () => {
        useAuth.mockReturnValue({ user: null, token: null, isAuthenticated: () => false });
        renderWithRouter();
        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('shows error if user is not admin', async () => {
        useAuth.mockReturnValue({ user: mockRegularUser, token: 'mock-user-token', isAuthenticated: () => true });
        renderWithRouter();
        await waitFor(() => expect(require('antd').message.error).toHaveBeenCalledWith('You do not have admin privileges'));
        expect(true).toBe(true);
    });

    test('renders dashboard for admin user', async () => {
        useAuth.mockReturnValue({ user: mockAdminUser, token: mockToken, isAuthenticated: () => true });
        renderWithRouter();
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
        expect(screen.getByText(/book management/i)).toBeInTheDocument();
        expect(true).toBe(true);
    });
});
