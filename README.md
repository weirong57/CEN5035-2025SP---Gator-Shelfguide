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

## 📽️ Final Presentation Demo / 项目最终演示

<video width="100%" controls>
  <source src="https://raw.githubusercontent.com/weirong57/CEN5035-2025SP---Gator-Shelfguide/Main/Video/Final%20Presentation%20Demo.mp4" type="video/mp4">

</video>

> This demo video showcases the major backend and frontend functionalities of the Library Management System.  
> 本演示视频展示了图书管理系统的核心后端与前端功能。


> This demo video showcases the major backend and frontend functionalities of the Library Management System.  





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


     
