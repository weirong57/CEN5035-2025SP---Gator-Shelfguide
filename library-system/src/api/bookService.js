// src/api/bookService.js
import apiClient from './client';

export const bookService = {

  getBooks: async (search) => {
    return apiClient.get('/books', { params: { search } });
  },


  borrowBook: async (bookId) => {
    return apiClient.post('/borrow', { bookId });
  },

  returnBook: async (bookId) => {
    return apiClient.post('/borrow/return', { bookId });
  },


  addBook: async (bookData) => {
    return apiClient.post('/books', bookData);
  },


  updateBook: async (id, bookData) => {
    return apiClient.put(`/books/${id}`, bookData);
  }
};