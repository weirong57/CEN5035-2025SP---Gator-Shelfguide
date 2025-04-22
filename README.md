# Gator Shelfguide - CEN5035 Software Engineering Project (Spring 2025)

## Team Members

| NAME                  | GITHUB NAME     | EMAIL                     |
| :-------------------- | :-------------- | :------------------------ |
| Rong Wei              | weirong57       | rong.wei@ufl.edu         |
| Abhinav Lakkapragada  | AbhinavLakkapragada | lakkapragada.a@ufl.edu    |
| Anirudh Ramesh        | Anir11          | ramesh.anirudh@ufl.edu    |
| Yichen Pan            | lishuang1103    | panyichen@ufl.edu         |

## Overview

This is a fully functional backend for a Library Management System built with Golang and MySQL, featuring a clear modular architecture and high maintainability. It supports essential features such as user authentication, book management, borrowing and returning operations, a review system, and administrator role control, making it ideal for education, academic coursework, or small-scale library platforms.

To ensure data security and consistency, the system leverages a well-structured relational database schema. All operations are wrapped in transactions to maintain atomicity, and foreign key constraints are used to prevent issues like unauthorized reviews or accidental data deletion. This design guarantees data integrity and reliability even under concurrent usage scenarios.

This project was developed as part of the CEN5035 Software Engineering course at the University of Florida.


## 🚀 Key Features 

🔐 JWT Authentication

- Supports user registration and login, with JWT tokens issued upon successful login  
- Role-based access control: Different permissions for regular users and administrators

📚 Book Management

- Retrieve all books, search by keywords, and view detailed book information  
- Admins can add, update, and delete book entries

📦 Borrowing & Returning Books

- Users can borrow books (automatically reducing available stock) and generate borrowing records  
- Supports returning books and automatically calculates overdue days and late fees

✍️ Review System

- Only users who have borrowed a book can leave reviews, preventing spam  
- Supports star rating (1~5) and review comments, with public review listings

👤 User Profile & Borrowing History

- View registered user profile information and borrowing history (active or returned)

🧪 Unit Test Ready

- Includes test database initialization to support backend logic testing and validation

🌐 RESTful API with Swagger Documentation

- All endpoints are annotated with standard Swagger comments, generating interactive API documentation automatically

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* Go (version 1.x or later - specify version if known)
* Node.js and npm (for Frontend Setup)
* MySQL Server
* Git

## Getting Started / Setup

### 1. Clone the Repository

```bash
git clone https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide.git
cd CEN5035-2025SP---Gator-Shelfguide
```

### 2. Database Establishment
- Requirement: A running MySQL server (v8.0+) instance is required.
- SQL Script: You will need the library_db_init.sql script.
  - `https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/library_manual_setup/library_db_init.sql`
- Execution:
  1. Open MySQL Workbench (or another MySQL client).
  2. Connect to your local MySQL server.
  3. Open the `library_db_init.sql` script file.
  4. Execute the script (e.g., by clicking the ⚡ execute button in 
     Workbench).
- Outcome: This will create the `library_db` database and populate it with  
  the necessary tables and initial book records (e.g., C++ Primer, 
  Algorithms, Database). No default user accounts are created; users must 
  be registered via the application.

### 3. Backend Setup (Go)
- Navigate to Backend Directory:
```bash
cd library-backend
```
- Configure Environment Variables:
  1. Copy `.env.example` to `.env`
  2. Edit the `.env` file to match your local MySQL settings:
      - `DB_USER`, `DB_PASSWORD`
      - `JWT_SECRET`: any secret string used for token generation
- Install Dependencies: (Go handles dependencies via modules, often automatic with build/run)
  ```bash
  go mod tidy
  ```
- Run the Backend:
  ```bash
  go run main.go
  ```
The backend server should start, typically on the port specified in `.env` 
or defaulting(check main.go)

### 4. Frontend Setup

- **Navigate to the frontend directory**:
```bash
cd ../library-system
```

- **Install dependencies**:
```bash
npm install
```
> 💡 _Make sure your `package.json` is valid and all required packages are listed. If you encounter issues, try deleting `node_modules` and `package-lock.json`, then run `npm install` again._

- **Build the frontend** (for production deployment):
```bash
npm run build
```
> This command will generate an optimized production build in the `dist` directory.

- **Run the development server** (for local testing and development):
```bash
npm run dev
```
> This starts the frontend application in development mode. The terminal will output the local URL, typically `http://localhost:5173`.(To interact with backend, please use go run main.go and start at local URL like http://localhost:3000)

---

## Running the Application
  1. Ensure your MySQL database server is running and the library_db database 
   has been initialized using the `library_db_init.sql` script.
  2. Make sure the frontend has been packaged.
   (`npm run build`).
  3. Start the backend server from the library-backend directory (`go run main.go`).
 
  4. Open your web browser(Microsoft Edge is recommended) and navigate to the URL provided (e.g., `http://localhost:3000`).

---

## 🎬 Final Presentation Demo

[![Watch the Final Demo](https://img.youtube.com/vi/Wr-74u61lyk/maxresdefault.jpg)](https://www.youtube.com/watch?v=Wr-74u61lyk)

🎥 **Local Demo Video:**  
[Click here to watch the local demo video (GitHub-hosted)](https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/Video/Final%20Presentation%20Demo.mp4)

🔗 **YouTube Link:**  
[Click here to watch on YouTube](https://www.youtube.com/watch?v=Wr-74u61lyk)
🔗 **Frontend test:**
[https://youtu.be/4qoNnepj3Eg](https://youtu.be/4qoNnepj3Eg)
---


## Running Unit Tests

### Frontend
```bash
cd library-system
npm test
# run’s unit tests on all the functions at once, and shows how many have passed
```

[Link to Frontend Tests Demo Video - [TBD](https://youtu.be/4qoNnepj3Eg)]


### Backend (Go)
```bash
# Navigate to backend directory (if not already there)
cd library-backend

# Run unit tests for controllers package (add other packages if needed)
go test -v ./controllers

# Optional: Run all tests in the backend project
# go test -v ./...
```

[Link to Backend Tests Demo Video - https://youtu.be/OfPh8-QHlV8]

---

### 📖 Usage Guide

**Register or Log In**  
New users can create an account by registering with a username and password. Existing users can log in to access borrowing and review features. Upon login, a JWT token is issued for authenticated actions.

**Browse or Search for Books**  
Navigate to the book list to explore all available titles. You can use the search bar to filter books by title, author, or genre.

**View Book Details**  
Click on any book to view its full details, including ISBN, language, available copies, and user reviews.

**Borrow or Return a Book**  
- **Borrow:** If available, click the **"Borrow"** button to borrow the book. The system will reduce the available stock and record the borrow time.  
- **Return:** Use the **"Return"** button when you're ready to return the book. The system updates the return time and calculates overdue fines if applicable.

**Leave a Review**  
After borrowing a book, you may leave a rating and comment through the review section. Only users who have borrowed the book are eligible to leave a review. One user can make one comment for one book.

**Admin Access**  
Users with an administrator role can log in with special credentials to manage the system. Admins can Add or delete books through admin page. To set one account as admin, please sign up through the sign up page. Then set the role of this account as 'admin' in the database. To login to the admin page, please use login page and enter by accounts which roles are set as admin.


---

## 📘 API Documentation

📎 **Link to Full API Docs:**  
[`Back-end API Interface Documentation`](https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/Back-end%20API%20Interface%20Documentation.md)

### 🙌 Acknowledgements
This project was developed as part of CEN5035 Software Engineering (Spring 2025) at the University of Florida. 


     
