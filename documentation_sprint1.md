
# **Sprint 1 Progress Report**

## **Team Members**
| NAME               | GITHUB NAME | EMAIL                         |
|--------------------|------------|-------------------------------|
| Rong Wei          | weirong57 | [rong.weig@ufl.edu](mailto:rong.weig@ufl.edu) |
| Abhinav Lakkapragada | AbhinavLakkapragada         | [lakkapragada.a@ufl.edu](mailto:lakkapragada.a@ufl.edu) |
| Anirudh Ramesh    | Anir11        | [ramesh.anirudh@ufl.edu](mailto:ramesh.anirudh@ufl.edu) |                           
| Yichen Pan        | lishuang1103         | [panyichen@ufl.edu](mailto:panyichen@ufl.edu) |

---

**Demos:**
- Frontend Demo:
- Backend Demo: 

---

## **📌 Sprint 1 Goals (Ends on February 10th)**  
### **Goal:**
Establish the foundational system infrastructure, including environment setup and user management.

---

**Backend Achievements in Sprint 1**

Librarians often face challenges in tracking the availability of books.
Our project aims to integrate existing features and provide a more
intuitive system for students and librarians to locate the resources
they need efficiently.

## Backend Achievements in Sprint 1

Librarians often face challenges in tracking the availability of books. Our project aims to integrate existing features and provide a more intuitive system for students and librarians to locate the resources they need efficiently.

| Feature                                    | Status  | Description |
|--------------------------------------------|---------|-------------|
| **Migration from Node.js to Golang**       | ✅ Done | Migrated from Node.js (Express.js) to Golang (Gorilla Mux) for better performance, maintainability, and scalability. Refactored API endpoints and database interaction layers. |
| **Database Schema Design & Implementation** | ✅ Done | Designed and implemented MySQL schema with `Users`, `Books`, and `BorrowingRecords` tables. Optimized database with indexes. |
| **User Authentication & Role Management**  | ✅ Done | Implemented JWT-based authentication, user registration, and login. Established Role-Based Access Control (RBAC) for Students and Librarians. |
| **Backend API Testing & Debugging**        | ✅ Done | Used Postman for API testing. Fixed database schema mapping issues, MySQL column mismatches, and role validation logic inconsistencies. |


**👥 Labor Division (Backend Team)**

| Task               | Developer(s) | 
|--------------------|------------|
| Initial Node.js Backend Setup      | Abhinav & Rong Wei | 
| Migration to Golang Backend | Rong Wei | 
| Database Schema Design | Abhinav & Rong Wei |                           
| User Authentication (JWT)   | Abhinav Lakkapragada   |
| Role-Based Access Control (RBAC)    | Rong Wei     |                              
| API Testing & Debugging       | Abhinav & Rong Wei   |

---


*

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
