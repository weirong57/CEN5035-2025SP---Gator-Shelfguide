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

// @Summary      Borrow a Book
// @Description  Users borrow a book
// @Tags         Borrow Management
// @Accept       json
// @Produce      json
// @Param        borrowRequest  body  BorrowRequest           true "Borrow Request"
// @Success      200            {object} map[string]interface{} "Success Response"
// @Failure      400            {string} string "Invalid request data"
// @Failure      404            {string} string "Book not found"
// @Failure      500            {string} string "Database error"
// @Router       /borrow [post]

func BorrowBook(w http.ResponseWriter, r *http.Request) {
	var request BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// 开启事务 starting
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("Failed to start transaction:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// 先检查书籍是否存在，并获取当前库存量 First check whether the book exists and get the current inventory
	var availableCopies int
	err = tx.QueryRow("SELECT available_copies FROM Books WHERE id = ?", request.BookID).Scan(&availableCopies)
	if err == sql.ErrNoRows {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error while checking book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 检查是否有足够库存 Check if there is enough stock
	if availableCopies < 1 {
		http.Error(w, "No copies available", http.StatusBadRequest)
		return
	}

	// 执行更新库存（乐观锁方式）Perform an update inventory (optimistic lock mode)
	result, err := tx.Exec("UPDATE Books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0", request.BookID)
	if err != nil {
		log.Println("Error updating book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("Error checking rows affected:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if rowsAffected == 0 {
		http.Error(w, "No copies available", http.StatusBadRequest)
		return
	}

	// 插入借阅记录 Insert the borrowing record
	borrowedAt := time.Now()
	dueDate := borrowedAt.AddDate(0, 0, 14) // 借阅期限：14 天
	_, err = tx.Exec(
		"INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)",
		request.UserID, request.BookID, borrowedAt, dueDate,
	)
	if err != nil {
		log.Println("Error inserting borrowing record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 提交事务 Commit transaction
	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	// 返回成功响应 Return successful response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Book borrowed successfully",
		"dueDate": dueDate.Format("2006-01-02 15:04:05"),
	})
}

// @Summary      Return a Book
// @Description  Users return a book
// @Tags         Borrow Management
// @Accept       json
// @Produce      json
// @Param        returnRequest  body  BorrowRequest            true "Return Request"
// @Success      200            {object} map[string]interface{} "Success Response"
// @Failure      400            {string} string "Invalid request data"
// @Failure      404            {string} string "No active borrow record found"
// @Failure      500            {string} string "Database error"
// @Router       /borrow/return [post]

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
