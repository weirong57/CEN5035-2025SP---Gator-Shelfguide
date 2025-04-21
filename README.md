# Gator Shelfguide - CEN5035 Software Engineering Project (Spring 2025)

## Team Members

| NAME                  | GITHUB NAME     | EMAIL                     |
| :-------------------- | :-------------- | :------------------------ |
| Rong Wei              | weirong57       | rong.weig@ufl.edu         |
| Abhinav Lakkapragada  | AbhinavLakkapragada | lakkapragada.a@ufl.edu    |
| Anirudh Ramesh        | Anir11          | ramesh.anirudh@ufl.edu    |
| Yichen Pan            | lishuang1103    | panyichen@ufl.edu         |

## Overview

This is a fully functional backend for a Library Management System built with Golang and MySQL, featuring a clear modular architecture and high maintainability. It supports essential features such as user authentication, book management, borrowing and returning operations, a review system, and administrator role control, making it ideal for education, academic coursework, or small-scale library platforms.

To ensure data security and consistency, the system leverages a well-structured relational database schema. All operations are wrapped in transactions to maintain atomicity, and foreign key constraints are used to prevent issues like unauthorized reviews or accidental data deletion. This design guarantees data integrity and reliability even under concurrent usage scenarios.

This project was developed as part of the CEN5035 Software Engineering course at the University of Florida.


## 🚀 Key Features | 

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
git clone [https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide.git](https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide.git)
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
- Navigate to Frontend Directory:
```bash
cd ../library-system
```
- Install Dependencies:
```bash
npm install
```
`(Note: Resolve any package.json issues or missing dependencies first)`
-Run the Frontend Development Server:
```bash
npm run dev
```
This will typically start the frontend application, and the output will provide the URL to access it (e.g., `http://localhost:5173`).


## Running the Application
  1. Ensure your MySQL database server is running and the library_db database 
   has been initialized using the `library_db_init.sql` script.
  2. Start the backend server from the library-backend directory (`go run main.go`).
  3. Start the frontend development server from the library-system directory 
   (`npm run dev`).
  4. Open your web browser and navigate to the frontend URL provided by the 
   `npm run dev` output (e.g., `http://localhost:5173`).

## 🎬 Final Presentation Demo 

[![Watch the video ](https://img.youtube.com/vi/Wr-74u61lyk/maxresdefault.jpg)](https://youtu.be/Wr-74u61lyk?si=N-xYrtfw9LU0-F3A)

🔗 [Click here to watch the demo video on YouTube ](https://youtu.be/Wr-74u61lyk?si=N-xYrtfw9LU0-F3A)

> This video showcases the core features and usage of our library management system.  










## Running Unit Tests

### Backend (Go)
```bash
# Navigate to backend directory (if not already there)
cd library-backend

# Run unit tests for controllers package (add other packages if needed)
go test -v ./controllers

# Optional: Run all tests in the backend project
# go test -v ./...
```

[Link to Backend Tests Demo Video - TBD]

### Frontend
```bash
[Instructions for running frontend tests - TBD]
```

[Link to Frontend Tests Demo Video - TBD]

## Usage
- Register a new user account or log in with existing credentials.
- Browse or search for books.
- Click on a book to view details and reviews.
- Use the borrow/return/reserve buttons as needed.
- Administrators can log in with admin credentials to access administrative 
  functions (e.g., via a dedicated Admin page or specific UI elements) to 
  manage books and users.
- [More specific usage details - TBD]

## API Documentation
Link to API Documentation:
`https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/Back-end%20API%20Interface%20Documentation.md`


     
