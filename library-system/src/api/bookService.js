// src/api/bookService.js
/*
import apiClient from './client';

export const bookService = {

  getBooks: async (params) => {
    return apiClient.get('/books', { 
      params: {
        title: params.title,
        _page: params.current, 
        _limit: params.pageSize
      }
    });
  },


  borrowBook: async (payload) => {
    return apiClient.post('/borrow', {
      bookId: payload.bookId,
      userId: payload.userId 
    });
  },

  returnBook: async (payload) => {
    return apiClient.post('/borrow/return', {
      bookId: payload.bookId,
      userId: payload.userId
    });
  },


  addBook: async (bookData) => {
    return apiClient.post('/books', bookData);
  },


  updateBook: async (id, bookData) => {
    return apiClient.put(`/books/${id}`, bookData);
  }
};*/
// src/api/bookService.js
import apiClient from './client';

export const bookService = {
  /**
   * Get books with optional search parameters
   * @param {Object} params - Search parameters (title, author, _page, _limit)
   * @returns {Promise} Response with books data
   */
  getBooks: async (params = {}) => {
    try {
      const response = await apiClient.get('/books', { 
        params,
        // Preserve the full response to access headers
        transformResponse: [(data) => data] 
      });
      
      // Return both data and headers
      return {
        data: Array.isArray(response) ? response : response.data || [],
        headers: response.headers,
        total: response.total || (response.headers && response.headers['x-total-count'])
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch books');
    }
  },

  /**
   * Borrow a book by ID
   * @param {string|number} bookId - The ID of the book to borrow
   * @returns {Promise} Response with borrow operation result
   */
  borrowBook: async (bookId) => {
    try {
      const response = await apiClient.post('/borrow', { bookId });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to borrow book');
    }
  },

  /**
   * Return a book by ID
   * @param {string|number} bookId - The ID of the book to return
   * @returns {Promise} Response with return operation result
   */
  returnBook: async (bookId) => {
    try {
      const response = await apiClient.post('/borrow/return', { bookId });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to return book');
    }
  },

  /**
   * Add a new book
   * @param {Object} bookData - Book data to add
   * @returns {Promise} Response with the added book
   */
  addBook: async (bookData) => {
    try {
      const response = await apiClient.post('/books', bookData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to add book');
    }
  },

  /**
   * Update a book by ID
   * @param {string|number} id - The ID of the book to update
   * @param {Object} bookData - Updated book data
   * @returns {Promise} Response with the updated book
   */
  updateBook: async (id, bookData) => {
    try {
      const response = await apiClient.put(`/books/${id}`, bookData);
      return response;
    } catch (error) {
      throw new Error(error.message || 'Failed to update book');
    }
  }
};

export default bookService;