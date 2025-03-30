# 📘 Gator-Shelfguide – Library Backend API  
🗓️ Sprint 3 Summary — Date: 2025-03-30

---
## 📌 Sprint 3 Completed Tasks--frontend


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
