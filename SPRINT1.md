
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
- Frontend Demo: (https://youtu.be/ltjNf8S4mcw) (Two person in one video)
- Backend Demo: (Rong:https://www.youtube.com/watch?v=fNTUai8AgsQ) (Abhinav:https://www.youtube.com/watch?v=RrBt6CoGP2k)

---

## **User story:**
User Story 1: Regular User Registration  
Role: Unregistered User  
Goal: Register an account to access borrowing features  
Requirements:  
Enter account (username/email), password, and name to complete registration.
 
User Story 2: Manage Books
Role: Administrator  
Goal: Maintain library book data  
Requirements:  
Add new books (title, author, category, shelf number, etc.)  
Edit or delete existing books  
Bulk import books
 

User Story 3: Return Books and Overdue Reminders  
Role: Regular User  
Goal: Return books on time and receive reminders  
Requirements:  
User center displays books to be returned and due dates  
Send daily email/in-app notifications after overdue  
Automatically calculate fines (if overdue) upon return

---
## **📌 Sprint 1 Goals (Ends on February 10th)**  
### **Goal:**
Establish the foundational system infrastructure, including environment setup and user management.
## **🛠 Key Tasks（Include Frontend and Backend ）**

### **1️⃣ Project Environment & Database Structure**
- ✅ Set up the development environment and confirm the tech stack (front-end framework, back-end language, database type, etc.).
- ✅ Design an initial database schema, including core tables such as `Users`, `Books`, and `Borrowing Records`.

### **2️⃣ User & Role Management**
- ✅ Implement **registration, login, and authentication**, ensuring secure password storage (hashed passwords).
- ✅ Differentiate **user permissions** (e.g., Normal User vs. Admin), with corresponding access restrictions.
- ✅ Provide **logout functionality** and session-based or **JWT-based authentication**.

### **3️⃣ Initial UI and Navigation Layout**
- ✅ Define the overall **system layout** and **navigation scheme**, ensuring a seamless user experience.
- ✅ Set up **placeholder pages** and  **login page** or sections for upcoming functionalities, such as:
  - 📚 **Book Management**
  - 🏠 **User Center**
  - 📊 **Admin Dashboard**

---
---
## **Frontend  in Sprint 1**
The system UI currently used by librarians is not simple and convenient enough. Our project aims to design a convenient and practical UI which can expand more convenient functions
| Feature                                    | Status  | Description |
|--------------------------------------------|---------|-------------|
| **Development environment setup**       | ✅ Done | Set up the development environment and develop using React and Ant Design.|
| **Design Main page** | ✅ Done | Design main page. Use the header and sidebar as navigation menus to provide extensibility points for integrating future features. |
| **Design Login page**  | ✅ Done | Design Login page. Design the user interface for account and password input fields, and include Login and Sign Up buttons.|
| **Implement login page redirection to the main interface**        | ✅ Done | Enable navigation from the login page to the dashboard using React Router after validation.|


**👥 Labor Division (Frontend Team)**

| Task               | Developer(s) | 
|--------------------|------------|
| Development environment setup | Yichen Pan &  Anirudh Ramesh | 
| Design Main page | Yichen Pan| 
| Design Login page | Anirudh Ramesh|                           
| Implement login page redirection to the main interface   | Yichen Pan &  Anirudh Ramesh|
## **📌 Next Steps**
- 🔜 Implement Signup page.
- 🔜 Design functional subpages under the main page and integrate backend development features.
---


## **Backend  in Sprint 1**
Librarians often face challenges in tracking the availability of books. Our project aims to integrate existing features and provide a more intuitive system for students and librarians to locate the resources they need efficiently.We planned to complete the following functions in node 1, user registration and login , administrator functions (book management, borrowing records), user borrowing. In node 1 we completed all the tasks that we expected and successfully realized them. The table shows the objectives of the tasks we accomplished.

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

## **📌 Next Steps**
- 🔜 Implement **Book Management**: CRUD operations for books.
- 🔜 Develop **Borrowing & Return Features**: Allow users to borrow and return books.
---

### **📝 Notes**

-   Migration from **Node.js to Golang** was a major improvement in
    terms of **performance and scalability**.

-   Regular **weekly progress meetings** ensured smooth coordination
    among team members.

-   The **backend structure is now stable**, allowing us to focus on new
    feature development in Sprint 2.

---

## **✅ Summary**
Sprint 1 successfully laid the foundation for our **Library Management System**, including environment setup, authentication, and initial UI structure. Moving forward, we will focus on refining our features and implementing core functionalities.

---



