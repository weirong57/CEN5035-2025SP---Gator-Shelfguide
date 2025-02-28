package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
)

// BorrowRequest struct for borrowing a book
type BorrowRequest struct {
	UserID int `json:"userId"`
	BookID int `json:"bookId"`
}

//	@Summary		借书 / Borrow a Book
//	@Description	用户借阅书籍 / Users borrow a book
//	@Tags			借阅管理 / Borrow Management
//	@Accept			json
//	@Produce		json
//	@Param			borrowRequest	body		BorrowRequest			true	"借书请求 / Borrow Request"
//	@Success		200				{object}	map[string]interface{}	"成功响应 / Success Response"
//	@Failure		400				{string}	string					"无效的请求数据 / Invalid request data"
//	@Failure		404				{string}	string					"图书未找到 / Book not found"
//	@Failure		500				{string}	string					"数据库错误 / Database error"
//	@Router			/borrow [post]
// BorrowBook handles the book borrowing request
func BorrowBook(w http.ResponseWriter, r *http.Request) {
	var request BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Start a transaction
	tx, err := config.DB.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Check if the book is available
	var availableCopies int
	err = tx.QueryRow("SELECT available_copies FROM Books WHERE id = ? FOR UPDATE", request.BookID).Scan(&availableCopies)
	if err == sql.ErrNoRows {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if availableCopies < 1 {
		http.Error(w, "No copies available", http.StatusBadRequest)
		return
	}

	// Insert borrowing record
	borrowedAt := time.Now()
	dueDate := borrowedAt.AddDate(0, 0, 14) // Borrowing period: 14 days

	_, err = tx.Exec(
		"INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)",
		request.UserID, request.BookID, borrowedAt, dueDate,
	)
	if err != nil {
		log.Println("Error inserting borrowing record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Update book availability
	_, err = tx.Exec("UPDATE Books SET available_copies = available_copies - 1 WHERE id = ?", request.BookID)
	if err != nil {
		log.Println("Error updating book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Commit the transaction
	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Book borrowed successfully",
		"dueDate": dueDate,
	})
}

//	@Summary		还书 / Return a Book
//	@Description	用户归还书籍 / Users return a book
//	@Tags			借阅管理 / Borrow Management
//	@Accept			json
//	@Produce		json
//	@Param			returnRequest	body		BorrowRequest			true	"还书请求 / Return Request"
//	@Success		200				{object}	map[string]interface{}	"成功响应 / Success Response"
//	@Failure		400				{string}	string					"无效的请求数据 / Invalid request data"
//	@Failure		404				{string}	string					"没有找到借阅记录 / No active borrow record found"
//	@Failure		500				{string}	string					"数据库错误 / Database error"
//	@Router			/borrow/return [post]
// ReturnBook handles the book return request
func ReturnBook(w http.ResponseWriter, r *http.Request) {
	var request BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Start a transaction
	tx, err := config.DB.Begin()
	if err != nil {
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Find the active borrowing record
	var recordID int
	var dueDate time.Time
	err = tx.QueryRow(
		"SELECT id, due_date FROM BorrowingRecords WHERE user_id = ? AND book_id = ? AND returned_at IS NULL ORDER BY borrowed_at DESC LIMIT 1",
		request.UserID, request.BookID,
	).Scan(&recordID, &dueDate)

	if err == sql.ErrNoRows {
		http.Error(w, "No active borrow record found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Update returned_at timestamp
	returnedAt := time.Now()
	_, err = tx.Exec("UPDATE BorrowingRecords SET returned_at = ? WHERE id = ?", returnedAt, recordID)
	if err != nil {
		log.Println("Error updating borrow record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Update book availability
	_, err = tx.Exec("UPDATE Books SET available_copies = available_copies + 1 WHERE id = ?", request.BookID)
	if err != nil {
		log.Println("Error updating book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Calculate overdue days and fine
	overdueDays := 0
	fine := 0
	if returnedAt.After(dueDate) {
		overdueDays = int(returnedAt.Sub(dueDate).Hours() / 24)
		fine = overdueDays * 1 // Assume $1 fine per day
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "Book returned successfully",
		"overdueDays": overdueDays,
		"fine":        fine,
	})
}
