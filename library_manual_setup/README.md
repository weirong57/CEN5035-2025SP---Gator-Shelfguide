# 📚 Library Management System - Setup Guide

This guide explains how to set up the `library_db` database and configure the backend for local development.

---

## ✅ Step 1: Import the SQL file

1. Open **MySQL Workbench**
2. Open the file: `library_db_init.sql`
3. Connect to your MySQL server
4. Click the ⚡ execute button
5. The database `library_db` will be created and populated with initial book records

---

## ✅ Step 2: Configure your environment

1. Copy `.env.example` to `.env`
2. Edit the `.env` file to match your local MySQL settings:
   - `DB_USER`, `DB_PASSWORD`
   - `JWT_SECRET`: any secret string used for token generation

---

## ✅ Step 3: Run the backend

```bash
go run main.go
```

Backend will run at: http://localhost:3000

---

## 🧪 Test Users and Data

- 📘 Preloaded 3 books (C++Primer, Algorithms, Database)
- 👤 No user accounts inserted by default — you can register via `/register` endpoint

---

## 🛡️ Notes

- Requires MySQL 8.0+ and Go 1.18+.
- For any issue, make sure `.env` matches your DB config.
