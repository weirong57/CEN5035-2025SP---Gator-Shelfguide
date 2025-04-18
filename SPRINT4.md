# 🚀 Sprint 4 - Final Sprint Report (Backend Team)

## 📌 Overview

Sprint 4 marks the completion and final integration of all core backend functionalities for the Gator ShelfGuide Library Management System. As backend developers, our focus was on ensuring a robust, secure, and scalable API to support all user and admin operations within the application.

This sprint primarily involved:
- Finalizing CRUD operations for books, reviews, and reservations.
- Ensuring proper authentication and role-based access control (RBAC) across endpoints.
- Testing and documenting all API endpoints with sample payloads.
- Ensuring JWT-based security and token verification middleware.
- Addressing bug fixes and optimizing endpoints for deployment.

---

## 🔧 Key Backend Tasks Completed

| Task | Description |
|------|-------------|
| 🔐 JWT Authentication | Implemented secure login and registration with JWT-based authentication. |
| 📚 Book Management | Built CRUD APIs to manage book listings with full admin control. |
| 🧾 Review System | Developed endpoints for users to add and fetch reviews with ratings. |
| 📦 Borrow/Return System | Enabled borrowing and returning of books with validations. |
| 🕐 Reservation System | Added support for reserving and cancelling book reservations. |
| 📄 Middleware | Added token verification middleware to protect private routes. |
| 🧪 Testing & Debugging | Used Postman and unit tests to validate API behavior. |
| 📜 API Documentation | Created detailed and structured API documentation (see below). |

---

# 📘 Library Management System API Documentation

This document provides a detailed explanation of all backend API endpoints for the Library Management System, including HTTP methods, paths, parameter structures, response formats, and permission requirements.

---

## 🧑‍💻 User Authentication Endpoints

### 🔐 POST `/api/register` – User Registration
- **Description**: Allows users to register a new account, with an option to register as a normal user or admin.
- **Headers**: `Content-Type: application/json`
- **Permission**: Public
- **Request Body**:
```json
{
  "username": "alice123",
  "password": "securePass123",
  "role": "user"  // or "admin"
}
```
- **Sample Response**:
```json
{
  "message": "User registered successfully"
}
```

---

### 🔐 POST `/api/login` – User Login
- **Description**: Login using username and password to receive a JWT authorization token.
- **Headers**: `Content-Type: application/json`
- **Permission**: Public
- **Request Body**:
```json
{
  "username": "alice123",
  "password": "securePass123"
}
```
- **Sample Response**:
```json
{
  "message": "Login successful",
  "token": "jwt_token_string"
}
```

---

## 📚 Book Management Endpoints

### 📖 GET `/api/books` – Get Book List
- **Description**: Retrieve information for all books in the system.
- **Permission**: Public
- **Sample Response**:
```json
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Programming",
    "language": "English",
    "available_copies": 5,
    "shelf_number": "A01",
    "isbn": "9780132350884"
  }
```

---

### 📖 GET `/api/books/{id}` – Get Book by ID
- **Description**: Retrieve detailed information of a specific book by its ID.
- **Path Parameters**:
  - `id` (integer): ID of the book to fetch.
- **Permission**: Public
- **Sample Request**:
  - `GET /api/books/1`
- **Sample Response**:
```json
  {
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Programming",
    "language": "English",
    "available_copies": 5,
    "shelf_number": "A01",
    "isbn": "9780132350884"
  }
```

---

### ➕ POST `/api/books` – Add New Book
- **Description**: Admin can add a new book to the system.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Admin
- **Request Body**:
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "Software",
  "language": "English",
  "available_copies": 3,
  "shelf_number": "B01",
  "isbn": "9780201616224"
}
```
- **Sample Response**:
```json
{
  "message": "Book added successfully"
}
```

---

### ✏️ PUT `/api/books/{id}` – Update Book Info
- **Description**: Admin can update existing book information.
- **Path Parameters**:
  - `id` (integer): ID of the book to update.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Admin
- **Sample Request**:
  - `GET /api/books/1`
- **Request Body**:
```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "Software",
  "language": "English",
  "available_copies": 3,
  "shelf_number": "B01",
  "isbn": "9780201616224"
}
```
- **Sample Response**:
```json
{
  "message": "Book updated successfully"
}
```

---

### ❌ DELETE `/api/books/{id}` – Delete Book
- **Description**: Admin can delete a book from the system.
- **Path Parameters**:
  - `id` (integer): ID of the book to delete.
- **Headers**:
  -  `Authorization: Bearer <token>`
- **Permission**: Admin
- **Sample Request**:
  - `DELETE /api/books/1`
- **Sample Response**:
```json
{
  "message": "Book deleted successfully"
}
```

---

## 📦 Borrow and Return Endpoints

### 📥 POST `/api/borrow` – Borrow a Book
- **Description**: A logged-in user can borrow a book.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Authenticated User
- **Request Body**:
```json
{
  "user_id": 1,
  "book_id": 2
}
```
- **Sample Response**:
```json
{
  "message": "Book borrowed successfully"
}
```

---

### 📤 POST `/api/borrow/return` – Return a Book
- **Description**: A logged-in user can return a borrowed book.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Authenticated User
- **Request Body**:
```json
{
  "user_id": 1,
  "book_id": 2
}
```
- **Sample Response**:
```json
{
  "message": "Book returned successfully"
}
```

---

## 📌 Book Reservation Endpoints

### 🕐 POST `/api/reservations` – Create Reservation
- **Description**: Create a reservation for a book.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Authenticated User
- **Request Body**:
```json
{
  "user_id": 1,
  "book_id": 2
}
```
- **Sample Response**:
```json
{
  "message": "Reservation created successfully"
}
```

---

### ❌ POST `/api/reservations/cancel` – Cancel Reservation
- **Description**: Cancel a previously made reservation.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Authenticated User
- **Request Body**:
```json
{
  "user_id": 1,
  "book_id": 2
}
```
- **Sample Response**:
```json
{
  "message": "Reservation cancelled successfully"
}
```

---

### 🔍 GET `/api/reservations` – Get User Reservations
- **Description**: Retrieve all reservation records of the current user.
- **Headers**:
  -  `Authorization: Bearer <token>`
- **Permission**: Authenticated User
- **Sample Response**:
```json
{
  "reservation_id": 101,
  "user_id": 1,
  "book_id": 2,
  "book_title": "The Pragmatic Programmer",
  "reserved_on": "2025-04-15T10:00:00Z"
}
```

---

## 📝 Book Review Endpoints

### ✍️ POST `/api/reviews` – Add Review
- **Description**: A user can add a review and rating to a book.
- **Headers**:
  -  `Authorization: Bearer <token>`
  -  `Content-Type: application/json`
- **Permission**: Authenticated User
- **Request Body**:
```json
{
  "user_id": 1,
  "book_id": 2,
  "rating": 5,
  "comment": "Excellent!"
}
```
- **Sample Response**:
```json
{
  "message": "Review added successfully"
}
```

---

### 🗂️ GET `/api/reviews` – Get Reviews
- **Description**: Retrieve all reviews or reviews for a specific book.
- **Query Parameters (optional)**:
  - `book_id` (integer): Fliter reviews by a specific book.
- **Permission**: Public
- **Sample Request**:
  - `GET /api/reviews?book_id=2
- **Sample Response**:
```json
{
  "review_id": 201,
  "user_id": 1,
  "book_id": 2,
  "rating": 5,
  "comment": "Excellent!",
  "reviewed_on": "2025-04-16T14:32:00Z"
}
```

---

📌 All endpoints requiring authentication must include the following header:
```http
Authorization: Bearer <token>
```

📌 All requests use JSON format and must include:
```http
Content-Type: application/json
```

---

For PDF export or integration into documentation platforms, contact the system maintainer or development team.

