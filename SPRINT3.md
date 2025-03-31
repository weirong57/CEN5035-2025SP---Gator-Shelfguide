# 📘 Gator-Shelfguide – Library Backend API  
🗓️ Sprint 3 Summary — Date: 2025-03-30

---
## 📌 Sprint 3 Completed Tasks--frontend
- Video:Yichen Pan(page implementation)https://youtu.be/Uxxut91ZpgQ Anirudh Ramesh(testing)https://youtu.be/WK8Yhwof3Fw

- Implementation:
- User center page, search page, welcome page.(All pages for main function are now finished.) Admin page design and complete some of the functions like book management.
- Allow returning book from User center, searching details of books and rating with review.

- Testing result:
- Bookmanagement(previous sprint):
-       [DEBUG] Processed data: [
        {
          id: 1,
          title: 'Test Book 1',
          author: 'Author 1',
          isbn: '123-456',
          available_copies: 3
        }
      ]

      at log (src/pages/BookManagement.jsx:33:15)

      [DEBUG] Processed data: [
        {
          id: 1,
          title: 'Test Book 1',
          author: 'Author 1',
          isbn: '123-456',
          available_copies: 3
        }
      ]

      at log (src/pages/BookManagement.jsx:33:15)

      [DEBUG] Processed data: [
        {
          id: 1,
          title: 'Test Book 1',
          author: 'Author 1',
          isbn: '123-456',
          available_copies: 3
        }
      ]

      at log (src/pages/BookManagement.jsx:33:15)


Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        4.894 s

- User Center Component Tests
- Purpose:
- Verify that the User Center component renders the user profile and borrowing records.
- Simulate the book return process and ensure that the appropriate success message is
shown.
- Key Test Cases:
- Render Test: Confirms that the user's name and borrowing records are rendered
correctly.
- Book Return Test: Uses a mocked API call to simulate a book return and verifies that
clicking the "Return" button triggers the success message.
- Sample Test Output:
- PASS src/pages/tests/UserCenter.test.js (11.468 s)
- UserCenter Component
- ✓ renders user profile and borrowing records (4 ms)
- ✓ simulates book return (6 ms)

- Search and Book details Component Tests
- Purpose:
- Verify that when the search query is empty, a warning message is shown.
- Simulate a successful book search with a mock review and ensure the component
displays the book details and the review.
- Key Test Cases:
- Empty Search Warning: When the search input is empty, the component should display
a warning message: "Please enter a book title."
- Successful Search Test: Mocks a successful search where the book details ("Test
Book") and a review ("Great book") are returned. The test waits for these elements to
appear in the DOM.
- Sample Test Output:
- PASS src/pages/tests/Reports.test.js (11.652 s)
- BookReport Component
- ✓ shows warning if search query is empty (5 ms)
- ✓ displays book details and reviews on successful search (7 ms)

## 📌 Sprint 3 Completed Tasks--Backend

### ✅ Controller Implementation

- Finished and tested:
  - User registration & login (`authController.go`)
  - Book CRUD management
  - Borrowing and returning books (`borrowController.go`)
  - Book reservation (`reservationController.go`)
  - Book review system (`reviewController.go`)

---

## 📁 Project Structure

```bash
library-backend/
├── controllers/         
│   ├── authController.go          
│   ├── bookController.go          
│   ├── borrowController.go        
│   ├── ✅ reservationController.go    
│   ├── ✅ reviewController.go         
│   └── *_test.go                 # Unit tests
├── routes/             
├── config/             
├── middleware/
├── models/
│   ├── ✅ book.go        
│   ├── ✅ borrow.go           
│   ├── ✅ user.go        
│   ├── ✅ reservation.go    
│   └── ✅ reviewCr.go         
├── docs/                # Auto-generated Swagger documentation
└── main.go             
```

---

## ✅ Feature to Test Case Mapping

| Feature              | Endpoint                | Test File                     | Result     |
|----------------------|--------------------------|-------------------------------|------------|
| User Registration    | POST `/register`         | `authController_test.go`      | ✅ PASS     |
| User Login           | POST `/login`            | `authController_test.go`      | ✅ PASS     |
| Add Book             | POST `/books`            | `bookController_test.go`      | ✅ PASS     |
| Borrow Book          | POST `/borrow`           | `borrowController_test.go`    | ✅ PASS     |
| Reserve Book         | POST `/reservations`     | `reservationController_test.go` | ✅ PASS  |
| Review Book          | POST `/reviews`          | `reviewController_test.go`    | ✅ PASS     |
| View Book Reviews    | GET `/reviews?bookId=1`  | `reviewController_test.go`    | ✅ PASS     |

---
### ✅ Test Result Summary

All controller unit tests have passed successfully:

```bash
$ go test -v ./controllers

--- PASS: TestRegisterUser
--- PASS: TestLoginUser
--- PASS: TestAddBook
--- PASS: TestBorrowBook
--- PASS: TestCreateReservation
    --- PASS: Valid Reservation
    --- PASS: Invalid Book ID
--- PASS: TestAddReview
    --- PASS: Valid Review
    --- PASS: Invalid Rating
    --- PASS: Missing Required Fields
--- PASS: TestGetBookReviews
    --- PASS: Valid Book ID
    --- PASS: Missing Book ID
    --- PASS: Invalid Book ID

PASS
ok   library-backend/controllers   0.22s
```

✅ **All unit tests passed without error. The backend is stable and well-tested.**
## 🧪 Unit Testing

- Each controller includes corresponding unit test files.
- Test coverage includes:
  - ✅ Normal use cases
  - ❌ Invalid/missing input fields
  - 🔁 Conflict scenarios (duplicate review/reservation)
  - 🔐 Token-based access to protected resources
- Uses in-memory SQLite database for safe isolated testing.

> ✔️ All tests passed and ready for integration.

---

## 📚 Swagger API Documentation

- All routes annotated with Swagger-style tags.
- Generated via `swaggo/swag`, outputs stored in `/docs`.
- Accessible via browser at:

  👉 `http://localhost:3000/swagger/index.html`

---

## 🚀 How to Run

```bash
# Start the backend server
$ go run main.go

# Run unit tests
$ go test -v ./controllers

# Generate Swagger documentation
$ swag init --parseDependency --parseInternal
```

---

## 📝 To-Do-Sprint4

- [ ] Define a consistent error response struct to replace default `string` errors in Swagger (`map[string]string`)
- [ ] Implement admin-user role separation and RBAC
- [ ] Add test coverage reports and CI integration
---
