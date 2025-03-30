package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
	"library-backend/models"
)

// BorrowBook 借阅图书 (Borrow a Book)
// @Summary 借阅图书 (User borrows a book)
// @Description 用户借阅图书，库存 -1，并创建借阅记录 (User borrows a book, reduces available copies, and creates borrowing record)
// @Tags 借阅管理 (Borrow Management)
// @Accept json
// @Produce json
// @Param borrowRequest body models.BorrowRequest true "借阅请求参数 (Borrow Request)"
// @Success 200 {object} map[string]interface{} "借阅成功 (Success Response)"
// @Failure 400 {object} map[string]string "请求数据错误 (Invalid request data)"
// @Failure 404 {object} map[string]string "图书未找到或无库存 (Book not found or unavailable)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /borrow [post]
func BorrowBook(w http.ResponseWriter, r *http.Request) {
	var request models.BorrowRequest
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

// ReturnBook 归还图书 (Return a Book)
// @Summary 归还图书 (User returns a book)
// @Description 用户归还图书，更新记录与库存，计算逾期罚款 (User returns a borrowed book, updates record and stock, calculates fine)
// @Tags 借阅管理 (Borrow Management)
// @Accept json
// @Produce json
// @Param returnRequest body models.BorrowRequest true "归还请求参数 (Return Request)"
// @Success 200 {object} map[string]interface{} "归还成功 (Success Response)"
// @Failure 400 {object} map[string]string "请求数据错误 (Invalid request data)"
// @Failure 404 {object} map[string]string "无有效借阅记录 (No active borrow record found)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /borrow/return [post]
func ReturnBook(w http.ResponseWriter, r *http.Request) {
	var request models.BorrowRequest
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
