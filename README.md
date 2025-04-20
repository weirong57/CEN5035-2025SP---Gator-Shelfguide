# Gator Shelfguide - CEN5035 Software Engineering Project (Spring 2025)

## Team Members

| NAME                  | GITHUB NAME     | EMAIL                     |
| :-------------------- | :-------------- | :------------------------ |
| Rong Wei              | weirong57       | rong.weig@ufl.edu         |
| Abhinav Lakkapragada  | AbhinavLakkapragada | lakkapragada.a@ufl.edu    |
| Anirudh Ramesh        | Anir11          | ramesh.anirudh@ufl.edu    |
| Yichen Pan            | lishuang1103    | panyichen@ufl.edu         |

## Overview

Gator Shelfguide is a comprehensive library management system designed to streamline book borrowing, returns, reservations, and administrative tasks for libraries. This project allows users to easily search for books, manage their borrowings, and interact with library services, while providing administrators with tools to manage the library's collection and user activities.

This project was developed as part of the CEN5035 Software Engineering course at the University of Florida.

## Features

**User Features:**
* User registration and login with authentication (JWT).
* Search for books using keywords (title, author, genre).
* Browse available books and view details.
* Borrow available books with due date tracking.
* Return borrowed books.
* View personal borrowing history and status.
* Place reservations on unavailable books.
* Cancel existing reservations.
* Add reviews (rating and comment) for borrowed books.
* View reviews for books.
* Receive notifications/view fines for overdue books (Implementation details TBD).

**Administrator Features:**
* Login with distinct administrator privileges.
* Add new books to the library collection.
* Delete books from the collection.
* Modify existing book details (title, author, genre, language, shelf number, copies, ISBN).
* View borrowing records for users (Implementation details TBD - e.g., all records or specific user).
* Manage user comments/reviews (Implementation details TBD - e.g., delete inappropriate reviews).
* Organize books (primarily via modifying book details).

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

### 2. Backend Setup (Go)
- Navigate to Backend Directory:
```bash
cd library-backend
```
- Configure Environment Variables:
Create a `.env` file in the backend directory (`library-backend`). Populate it with your database credentials and a JWT secret. Example:

```bash
# .env file content
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost 
DB_PORT=3306 # Or your MySQL port
DB_NAME=library_db # Or the name you used
JWT_SECRET=your_strong_jwt_secret_key_here 
PORT=8080 # Or the port you want the backend to run on
```
Replace placeholder values with your actual configuration.
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

### 3. Frontend Setup
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

### 4. Database Setup
- Requirement: A running MySQL server instance is required.
- Schema Initialization:
  - Ensure you have created a database (e.g., `library_db`) on your MySQL   
    server that matches the DB_NAME in your `.env` file.
  - The necessary tables and schema structure are defined in the     
    full_library_db.sql file provided separately. You need to execute this 
    SQL script against your target database using a MySQL client (MySQL 
    Workbench, command line, etc.) to set up the required tables.
- `[Instructions for executing full_library_db.sql - TBD]`

## Running the Application
1. Ensure your MySQL database server is running and the database schema has 
   been initialized using the provided SQL script.
2. Start the backend server from the library-backend directory (`go run 
   main.go`).
3. Start the frontend development server from the library-system directory 
   (`npm run dev`).
4. Open your web browser and navigate to the frontend URL provided by the 
   `npm run dev` output (e.g., `http://localhost:5173`).

## Final Presentation Demo
[Link to Demo Video - TBD]

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
https://github.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/blob/Main/SPRINT4.md


     
