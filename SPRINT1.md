**Sprint 1 Progress Report**

**Team Members**

  ------------------------------------------------------------------------
  **Name**               **GitHub Username**    **Email**
  ---------------------- ---------------------- --------------------------
  Rong Wei               weirong57              <rong.weig@ufl.edu>

  Abhinav Lakkapragada   AbhinavLakkapragada    <lakkapragada.a@ufl.edu>

  Anirudh Ramesh         Anir11                 <ramesh.anirudh@ufl.edu>

  Yichen Pan             lishuang1103           <panyichen@ufl.edu>
  ------------------------------------------------------------------------

**Backend Achievements in Sprint 1**

**Objective**

Librarians often face challenges in tracking the availability of books.
Our project aims to integrate existing features and provide a more
intuitive system for students and librarians to locate the resources
they need efficiently.

**✅ Migration from Node.js to Golang**

-   Initially, we implemented the backend using **Node.js** with
    **Express.js**.

-   Midway through Sprint 1, we migrated to **Golang with Gorilla Mux**
    to improve:

    -   **Performance** -- Faster execution speed.

    -   **Maintainability** -- Easier long-term support.

    -   **Scalability** -- Better concurrency handling.

-   Refactored API endpoints and database interaction layers to align
    with the new Golang structure.

**✅ Database Schema Design & Implementation**

-   Designed and implemented a **relational database** using **MySQL**.

-   Core tables created:

    -   **Users** -- Stores user details and roles (Student, Librarian).

    -   **Books** -- Maintains book records.

    -   **BorrowingRecords** -- Tracks book borrowing and return
        transactions.

-   Optimized database schema with **indexes** for frequently queried
    columns.

**✅ User Authentication & Role Management**

-   Implemented **JWT-based authentication** for secure user sessions.

-   Developed **user registration and login functionality**.

-   Established **Role-Based Access Control (RBAC)**:

    -   **Students** -- Can search for and borrow books.

    -   **Librarians** -- Can manage book records and track borrowing
        history.

**✅ Book Management System**

• Implemented **CRUD operations** for books, including:

-   **Add a book** -- Librarians can add new books to the system.

-   **Update book details** -- Modify book information when needed.

-   **Delete books** -- Remove outdated or unavailable books.

-   **Retrieve book details** -- View book information.\
    • Developed **book search and filtering features**, allowing users
    to:

-   Search by id.

-   Filter available books for borrowing.

**✅ Book Borrowing & Returning System**

-   Implemented API endpoints for **book borrowing and returning**:

    -   Borrow Book API: Users can check out books.

    -   Return Book API: Updates book status upon return.

-   Added backend validation and error handling for scenarios such as:

    -   Attempting to borrow an already checked-out book.

    -   Exceeding borrowing limits.

    -   Returning a non-borrowed book.

**✅ Backend API Testing & Debugging**

-   Utilized **Postman** for API testing and validation.

-   Debugged and fixed issues related to:

    -   Incorrect **database schema mapping**.

    -   MySQL **column naming mismatches** (e.g., record_id → id).

    -   Role validation logic inconsistencies.

**👥 Labor Division (Backend Team)**

+------------------------------------------+---------------------------+
| **Task**                                 | **Developer(s)**          |
+==========================================+===========================+
| Initial Node.js Backend Setup            | Abhinav & Rong Wei        |
+------------------------------------------+---------------------------+
| Migration to Golang Backend              | Rong Wei                  |
+------------------------------------------+---------------------------+
| Database Schema Design                   | Abhinav & Rong Wei        |
+------------------------------------------+---------------------------+
| User Authentication (JWT)                | Abhinav Lakkapragada      |
+------------------------------------------+---------------------------+
| Role-Based Access Control (RBAC)         | Rong Wei                  |
|                                          |                           |
| Book Management System (CRUD)            | Rong Wei                  |
+------------------------------------------+---------------------------+
| Borrowing & Returning Books              | Abhinav Lakkapragada      |
+------------------------------------------+---------------------------+
| API Testing & Debugging                  | Abhinav & Rong Wei        |
+------------------------------------------+---------------------------+

**📌 Next Steps (Sprint 2 & Sprint 3 Plans)**

**Sprint 2 (February 11 - March 3)\
🔜 User Interface (UI) & Experience Enhancements\
• Develop and implement a user-friendly front-end interface for both
students and librarians.\
• Focus on making book search, borrowing, and returning processes more
intuitive for users.\
• Integrate visual aids (bookshelf numbers, book availability status) to
enhance user navigation.**

**🔜 Back-End and Front-End Integration\
• Integrate front-end and back-end systems to ensure seamless
communication between user interfaces and API endpoints.\
• Ensure that book borrowing, returning, and management functionalities
work smoothly across the full stack.\
• Test the integrated system to verify that data flows correctly between
the front-end and back-end.**

**🔜 Fines and Due Date Management\
• Implement overdue fines calculation and display.\
• Create a system for sending reminders about overdue books and fines to
users.**

**🔜 Testing & Performance Improvements\
• Conduct rigorous testing to ensure all back-end functionalities are
working seamlessly with the front-end.\
• Perform load testing to identify and address performance
bottlenecks.**

**Sprint 3 (March 4 - March 31)**\
🔜 **Librarian Dashboard & Admin Controls**\
• Implement a dashboard for librarians to monitor borrowing trends, book
availability, and user activity.\
• Provide enhanced admin tools for adding, updating, or removing books,
and tracking borrowing history.

🔜 **Advanced Features**\
• Implement book recommendations based on borrowing history and user
preferences.\
• Enable real-time notifications for book availability and borrowing
updates.

🔜 **User Feedback & System Refinement**\
• Collect feedback from students and librarians to identify areas of
improvement.\
• Iterate and refine the system based on feedback to improve user
experience and system efficiency.

**Sprint 1 - \"ShelfGuide\" Project**

**User Stories for Sprint 1:**

1.  **User Story 1: Regular User Registration**

    -   **Role**: Unregistered User

    -   **Goal**: Register an account to access borrowing features

    -   **Requirements**:

        -   Enter account (username/email), password, and name to
            complete registration.

2.  **User Story 5: User Login & Authentication**

    -   **Role**: Registered User (Student or Administrator)

    -   **Goal**: Securely log in to access library features

    -   **Requirements**:

        -   Enter username/email and password to authenticate

        -   Receive error messages for incorrect credentials

        -   Support password reset functionality

3.  **Issue 1: User registration, login, and authentication (Ordinary
    users and administrators)**

    -   **Goal**: Implement the registration, login, and authentication
        system

    -   **Planned Tasks**:

        -   Implement the user registration form to allow users to sign
            up.

        -   Set up the login system for both ordinary users and
            administrators.

        -   Implement password reset functionality.

    -   **Status**: Completed successfully.

4.  **Issue 2: Administrators\' Book Management & Users\' Borrowing
    Functions**

    -   **Goal**: Set up core functions like adding and deleting books
        for admins, and borrowing and returning books for users.

    -   **Planned Tasks**:

        -   Implement CRUD functionalities for book management.

        -   Allow users to borrow and return books.

    -   **Status**: Completed successfully. Book management system was
        created for admins, while basic borrowing and return functions
        were established.

**Issues Planned for Sprint 1:**

1.  **User Registration and Login**

    -   **Task**: Establish the foundation for user registration, login,
        and authentication, allowing both users and admins to access
        their respective features.

    -   **Status**: Completed successfully.

2.  **Administrator Functions (Book Management, Borrowing Records)**

    -   **Task**: Create an interface for admins to add, delete, and
        modify books. Also, implement basic borrowing records for users.

    -   **Status**: Completed successfully. Admins can manage books, and
        users can borrow and return books.

3.  **User Borrowing and Book Location**

    -   **Task**: Implement the book location feature (bookshelf/map) to
        assist users in finding books quickly. Display real-time book
        availability status (available/out of stock).

    -   **Status**: Not completed yet. The functionality was planned but
        was postponed to Sprint 2 for further integration with the
        back-end.

**Status of the Issues at the end of Sprint 1:**

-   **Completed**:

    -   User registration, login, and authentication were successfully
        implemented.

    -   Admin functionalities for adding, deleting, and modifying books
        were created.

    -   Basic book borrowing and returning functionality for users was
        set up.

-   **Not Completed**:

    -   The **Book Location Assistance** (shelf/map system) was not
        fully integrated. We plan to implement this feature in Sprint 2
        with real-time availability. Additionally, more detailed
        categorization and filtering systems for books will be
        introduced in later sprints.

**📝 Notes**

-   Migration from **Node.js to Golang** was a major improvement in
    terms of **performance and scalability**.

-   Regular **weekly progress meetings** ensured smooth coordination
    among team members.

-   The **backend structure is now stable**, allowing us to focus on new
    feature development in Sprint 2.

**✅ Summary**

Sprint 1 successfully established the **backend foundation**, covering:

-   **Authentication & Role Management** (JWT, RBAC).

-   **Database Design & Optimization** (MySQL, indexing, query
    performance).

-   **Book Borrowing System** (API endpoints, error handling,
    debugging).

-   **Migration to Golang**, which significantly improved system
    efficiency.

For Sprint 2, our primary focus will be on enhancing the user experience
with a seamless integration of front-end and back-end systems, refining
book management functionalities, implementing overdue fines and due date
reminders, and ensuring smooth performance through rigorous testing.

**Final Submission: April 21**

🚀 Backend for Sprint 1 is **ready and functional**! Moving forward to
Sprint 2. 🎯
