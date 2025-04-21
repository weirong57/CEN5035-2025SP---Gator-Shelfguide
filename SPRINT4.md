
---
# 🚀 **Sprint 4 - Final Sprint Report (Frontend Team)**

## 📌 **Overview**

The frontend team focus on the implementation of authorization function. Now the system can get the information of users from JWT. Meanwhile, we modified bookreview pages to fit review function. We also modified usercenter part to show borrowing history. The routing configuration for the admin page has been restructured and integrated with JWT authentication, enabling a more logical access path through the login interface. Additionally, we have optimized the admin interface's visual design to enhance usability, particularly streamlining the book addition/removal functionality for improved operational efficiency. Finally, we have collaborated with backend team members to fully implement all system functionalities. Additionally, all tests for the newly added frontend components have successfully passed.

---
## 👥 **Frontend Contribution Table**

| Name                     | GitHub ID             | Major Contributions                                                                                                                                    |
|--------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Yichen Pan**             | lishuang1103             | Represented the frontend team in frontend-backend integration. Implemented the frontend for authorization functionality. Refined the admin interface. |
| **Abhinav Lakkapragada** | AbhinavLakkapragada    | Designed full API process flows, validated Swagger annotations, maintained interactive API documentation, performed extensive Postman testing, and created production-ready test files. |





---

# 🚀 **Sprint 4 - Final Sprint Report (Backend Team)**

## 📌 **Overview**

Sprint 4 marks the completion and final integration of all core backend functionalities for the Gator ShelfGuide Library Management System. As backend developers, our focus was on ensuring a robust, secure, and scalable API to support all user and admin operations within the application.

This sprint primarily involved:
- Completed the front and back end merge work and aligned all interface work with the front end
- Added administrator related functionality and test files
- Added user center functionality, and test documentation
- Wrote full-featured test documentation

---


## 🔧 **Key Backend Tasks Completed (Sprint 4 Only)**

| Task                             | Description                                                                                 |
|----------------------------------|---------------------------------------------------------------------------------------------|
| 🔗 Frontend Integration          | Completed full integration with frontend; adjusted all API response formats to match UI needs. |
| 🛠️ Admin Feature Implementation  | Added administrator-only routes and implemented associated role-based access logic and unit tests. |
| 👤 User Center Functionality     | Implemented user profile and borrowing history retrieval endpoints; structured response format. |
| 🧪 Unit Testing & Environment    | Wrote unit test files for newly added controllers and ensured isolated test DB setup.       |
| 📃 Test Documentation            | Created detailed documentation for all backend test cases, including coverage of edge cases and invalid input handling. |

---
## 👥 **Backend Contribution Table**

| Name                     | GitHub ID             | Major Contributions                                                                                                                                    |
|--------------------------|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Rong Wei**             | weirong57              | Led full frontend-backend integration validation, implemented admin routing, role-based access control, and token middleware. Developed User Center and Admin UI features for book management, wrote comprehensive unit tests. |
| **Abhinav Lakkapragada** | AbhinavLakkapragada    | Designed full API process flows, validated Swagger annotations, maintained interactive API documentation, performed extensive Postman testing, and created production-ready test files. |

---

**Note:** To ensure code security and consistency, all backend members used Discord for code coordination, delivery, and coverage discussions.
The final version of the backend code was unified and submitted by Rong Wei, who also created a stable and publishable v1.0.0 release during the final phase of the sprint.

---

## ✅ **Backend Unit Tests Summary**

| 📁 Test File               | 🧪 Covered Functions                  | 🔍 Test Focus                                                                 |
|----------------------------|--------------------------------------|-------------------------------------------------------------------------------|
| `controllers_test.go`     | Environment Initialization           | Loads test `.env`, connects to isolated test DB                              |
| `userController_test.go`  | `GetUserProfile`, `GetUserBorrowingRecords` | Validates user ID parsing, missing users, borrowing status (returned vs active) |
| `authController_test.go`  | `RegisterUser`, `LoginUser`          | Validates username uniqueness, password hashing, and JWT token generation     |
| `adminController_test.go` | `AddBook`, `DeleteBook`              | Ensures only admins can access, checks input validity, verifies DB effects    |
| `bookController_test.go`  | `GetAllBooks`, `GetBookById`, `UpdateBook` | Checks query filtering, null field handling, and update success               |
| `borrowController_test.go`| `BorrowBook`, `ReturnBook`           | Validates inventory logic, transaction rollback, overdue fine calculation     |
| `reviewController_test.go`| `AddReview`, `GetBookReviews`        | Ensures only borrowers can comment, prevents duplicates, verifies review listing |
| `reservationController_test.go` | `CreateReservation`, `CancelReservation` | Enforces one reservation per user-book, tests reservation creation/cancellation |

---

## ✅ Unit Test Completion Status

We have successfully implemented **1:1 unit tests** for each backend controller function.  
All tests have been executed against an isolated test database and have **passed successfully**.

> 💡 Each controller function has a corresponding test case designed to verify:
> - Correct functionality under valid input  
> - Proper handling of invalid or missing parameters  
> - Enforcement of access permissions and role restrictions  
> - Transactional consistency and database effects  

This ensures our API endpoints are robust, secure, and reliable across typical and edge-case scenarios.

---

## 🧪 Unit Test Execution Log

All backend tests were executed using the Go test framework with the following command:

```bash
go test -v ./controllers/
```

📄 **Terminal Output:**
```
2025/04/20 17:27:00 📄 Loading environment from / attempting to load config: ..\.env.test
2025/04/20 17:27:00 🔍 DB_HOST = localhost
2025/04/20 17:27:00 🔍 DB_PORT = 3306
2025/04/20 17:27:00 🔍 DB_USER = root
2025/04/20 17:27:00 🔍 DB_PASSWORD = 123456
2025/04/20 17:27:00 🔍 DB_NAME = library_test_db
2025/04/20 17:27:00 ✅ Connected to test DB: library_test_db
=== RUN   TestAddBook_Success
--- PASS: TestAddBook_Success (0.00s)
=== RUN   TestRegisterUser_Success
📩 RegisterUser called
📤 Register request received for username: test_register_user
✅ Username available: test_register_user
✅ User registered successfully: test_register_user
--- PASS: TestRegisterUser_Success (0.01s)
=== RUN   TestLoginUser_Success
📤 Login request received for username: test_login_user
✅ User found for username: test_login_user
✅ JWT token generated successfully for user: test_login_user
📝 Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
--- PASS: TestLoginUser_Success (0.09s)
=== RUN   TestGetAllBooks_DefaultPagination
Query: SELECT * FROM Books LIMIT ? OFFSET ?
Params: [10 0]
--- PASS: TestGetAllBooks_DefaultPagination (0.00s)
=== RUN   TestBorrowBook_Success
📥 BorrowBook called
📨 Borrow request received: user_id=13, book_id=8
📦 Current inventory: 2
✅ Inventory updated successfully
✅ Borrow record inserted
✅ Borrow transaction committed
--- PASS: TestBorrowBook_Success (0.02s)
=== RUN   TestAddReview_Success
✅ Review added successfully: {14 9 4 Good book!}
--- PASS: TestAddReview_Success (0.03s)
=== RUN   TestGetUserProfile_Success
🔍 Retrieving user info: user_id = 15
✅ User info fetched: {Username:profile_user Password: Role: ID:15 CreatedAt:...}
--- PASS: TestGetUserProfile_Success (0.01s)
PASS
ok      library-backend/controllers     (cached)
```

✅ **Conclusion**: All controller unit tests passed. The backend has been functionally validated and is ready for deployment.

---

## 🎬 Unit Test Demo Video

To complement the test logs and documentation, we have recorded a video demonstrating the backend unit test execution in a live environment. This video shows how each controller function is tested and verified using real data in an isolated test database.

📺 **Watch the Unit Test Demo:**  
[![Watch the Unit Test Demo](https://img.youtube.com/vi/OfPh8-QHlV8/maxresdefault.jpg)](https://www.youtube.com/watch?v=OfPh8-QHlV8)

🔗 [Click here to open in YouTube](https://www.youtube.com/watch?v=OfPh8-QHlV8)

---
## 🧑‍💻 **User Authentication Endpoints**

### 🔐 **POST `/api/register`** – **User Registration**
- **Description**: Allows users to register a new account, with an option to register as a normal user or admin.
- **Headers**: `Content-Type: application/json`
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

### 🔐 **POST `/api/login`** – **User Login**
- **Description**: Login using username and password to receive a JWT authorization token.
- **Headers**: `Content-Type: application/json`
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

## 📚 **Book Management Endpoints**

### 📖 **GET `/api/books`** – **Get Book List**
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

### 📖 **GET `/api/books/{id}`** – **Get Book by ID**
- **Description**: Retrieve detailed information of a specific book by its ID.
- **Path Parameters**:
  - `id` (integer): ID of the book to fetch.
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

### ➕ **POST `/api/books`** – **Add New Book**
- **Description**: Admin can add a new book to the system.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
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

### ✏️ **PUT `/api/books/{id}`** – **Update Book Info**
- **Description**: Admin can update existing book information.
- **Path Parameters**:
  - `id` (integer): ID of the book to update.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
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

### ❌ **DELETE `/api/books/{id}`** – **Delete Book**
- **Description**: Admin can delete a book from the system.
- **Path Parameters**:
  - `id` (integer): ID of the book to delete.
- **Headers**:
  - `Authorization: Bearer <token>`
- **Permission**: Admin
- **Sample Response**:
```json
{
  "message": "Book deleted successfully"
}
```

---

## 📦 **Borrow and Return Endpoints**

### 📥 **POST `/api/borrow`** – **Borrow a Book**
- **Description**: A logged-in user can borrow a book.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
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

### 📤 **POST `/api/borrow/return`** – **Return a Book**
- **Description**: A logged-in user can return a borrowed book.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
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

## 📝 **Book Review Endpoints**

### ✍️ **POST `/api/reviews`** – **Add Review**
- **Description**: A user can add a review and rating to a book.
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
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

### 🗂️ **GET `/api/reviews`** – **Get Reviews**
- **Description**: Retrieve all reviews or reviews for a specific book.
- **Query Parameters**:
  - `book_id` (integer): Filter reviews by a specific book.
- **Permission**: Public
- **Sample Request**:
  - `GET /api/reviews?book_id=2`
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

### **General API Requirements:**
- **Authentication**: All routes requiring authentication must include the following header:
  ```http
  Authorization: Bearer <token>
  ```
- **Content Type**: All requests must use the `application/json` content type:
  ```http
  Content-Type: application/json
  ```
---

## 📘 API Documentation

For a complete reference of all backend API endpoints, request/response structures, and permission annotations, please refer to the full documentation below:

🔗 **Full API Documentation (Markdown):**  
[https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/Back-end%20API%20Interface%20Documentation.md](https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/Back-end%20API%20Interface%20Documentation.md)



