// src/api/services.js
import axios from 'axios';

// Base API configuration
const API_URL = 'http://localhost:3000';

// Create axios instance with common settings
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Authentication services
export const authService = {
  // POST /login - User login
  login: async (credentials) => {
    try {
      const response = await api.post('/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /register - Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Book management services
export const bookService = {
  // GET /books - Get all books with optional search
  getBooks: async (searchQuery = '') => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // GET /books/{id} - Get a specific book
  getBookById: async (id) => {
    try {
      const response = await api.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /books - Add a new book
  addBook: async (bookData) => {
    try {
      const response = await api.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // PUT /books/{id} - Update book by ID
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // DELETE /books/{id} - Delete book by ID
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// Borrow management services
export const borrowService = {
  // POST /borrow - Borrow a book
  borrowBook: async (bookId, userId) => {
    try {
      const borrowRequest = { bookId, userId };
      const response = await api.post('/borrow', borrowRequest);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /borrow/return - Return a book
  returnBook: async (bookId, userId) => {
    try {
      const returnRequest = { bookId, userId };
      const response = await api.post('/borrow/return', returnRequest);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};


// Reviews services
export const reviewService = {
  // GET /reviews - Get reviews for a book
  getReviews: async (bookId) => {
    try {
      const response = await api.get('/reviews', { params: { bookId } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // POST /reviews - Add a review
  addReview: async (reviewData) => {
    try {
      const response = await api.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  auth: authService,
  books: bookService,
  borrow: borrowService,
  reviews: reviewService
};