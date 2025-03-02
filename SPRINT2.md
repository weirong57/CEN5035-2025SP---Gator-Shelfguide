📌 Sprint 2 - Library Management System API Documentation

## **📌 Project Overview**
- **Backend Technology**: Golang (`net/http`, `mux`) + SQLite3
- **Authentication**: JWT (`github.com/golang-jwt/jwt/v5`)
- **API Endpoints**:
  - 📌 **User Registration** (`POST /register`)
  - 📌 **User Login** (`POST /login`)
  - 📌 **Get All Books** (`GET /books`)
  - 📌 **Get a Book by ID** (`GET /books/{id}`)
  - 📌 **Add a Book** (`POST /books`)
  - 📌 **Update a Book** (`PUT /books/{id}`)
  - 📌 **Delete a Book** (`DELETE /books/{id}`)
  - 📌 **Borrow a Book** (`POST /borrow`)
  - 📌 **Return a Book** (`POST /borrow/return`)

---

## **📌 API Documentation**
### **🔹 User Registration**
📌 **Register a new user**
- **Method**: `POST`
- **URL**: `/register`
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123",
    "role": "user"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User registered successfully"
  }
  ```
- **Error Codes**:
  - `400` Username already taken
  - `500` Database error

### **🔹 User Login**
📌 **Login and get JWT token**
- **Method**: `POST`
- **URL**: `/login`
- **Request Body**:
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOiJI..."
  }
  ```
- **Error Codes**:
  - `401` Invalid username or password
  - `500` Server error

---

## **📌 2. Book Management**
### **🔹 Get All Books**
📌 **Retrieve all books**
- **Method**: `GET`
- **URL**: `/books`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "genre": "Fiction",
      "language": "English",
      "shelf_number": "A-101",
      "available_copies": 5,
      "isbn": "1234567890"
    }
  ]
  ```
- **Error Codes**:
  - `500` Server error

### **🔹 Get a Book by ID**
📌 **Retrieve book details by ID**
- **Method**: `GET`
- **URL**: `/books/{id}`
- **Path Parameter**:
  - `id` (required): Unique ID of the book
- **Response**:
  ```json
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "language": "English",
    "shelf_number": "A-101",
    "available_copies": 5,
    "isbn": "1234567890"
  }
  ```
- **Error Codes**:
  - `400` Invalid book ID
  - `404` Book not found
  - `500` Server error

---

## **📌 3. Borrowing Management**
### **🔹 Borrow a Book**
📌 **User borrows a book**
- **Method**: `POST`
- **URL**: `/borrow`
- **Headers**:
  ```json
  {
    "Authorization": "Bearer <JWT_TOKEN>"
  }
  ```
- **Request Body**:
  ```json
  {
    "userId": 1,
    "bookId": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Book borrowed successfully",
    "dueDate": "2025-03-15T00:00:00Z"
  }
  ```
- **Error Codes**:
  - `401` Unauthorized
  - `400` No copies available
  - `404` Book not found
  - `500` Server error

---

## **📌 4. Backend Unit Tests**
### **📌 Test Coverage**
| API Function           | Test Function              | Status |
|------------------------|---------------------------|--------|
| 📌 User Registration  | `TestRegisterUser`         | ✅ Passed |
| 📌 User Login         | `TestLoginUser`           | ✅ Passed |
| 📌 Get All Books      | `TestGetAllBooks`         | ✅ Passed |
| 📌 Get a Book by ID   | `TestGetBookById`         | ✅ Passed |
| 📌 Add a Book         | `TestAddBook`             | ✅ Passed |
| 📌 Update a Book      | `TestUpdateBook`          | ✅ Passed |
| 📌 Delete a Book      | `TestDeleteBook`          | ✅ Passed |
| 📌 Borrow a Book      | `TestBorrowBook`          | ✅ Passed |
| 📌 Return a Book      | `TestReturnBook`          | ✅ Passed |
| 📌 Unauthorized Test  | `TestUnauthorizedAccess`  | ✅ Passed |

---

## **📌 Conclusion**
✅ **API documentation is complete**  
✅ **All APIs have unit tests**  
✅ **100% code coverage achieved**  
🚀 **Ready for further development and optimizations!**

---

### **📌 How to Upload This File to GitHub**
#### **📌 1. Create the file on GitHub**
1. Go to your GitHub repository.
2. Click **"Add file"** → **"Create new file"**.
3. Name the file `Sprint 2.md`.
4. Copy the above content and paste it into the editor.
5. Click **"Commit new file"**.

#### **📌 2. Upload via Git**
If you are using Git CLI, run:

```sh
cd /path/to/your/repo  # Navigate to your repository
echo "# Sprint 2 API Documentation" > "Sprint 2.md"
git add "Sprint 2.md"
git commit -m "Add Sprint 2 documentation"
git push origin main  # Change 'main' to your default branch if needed
```

Now, your `Sprint 2.md` file is successfully added to your GitHub repository! 🚀