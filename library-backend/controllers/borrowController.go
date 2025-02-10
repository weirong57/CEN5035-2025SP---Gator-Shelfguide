package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
)

// BorrowRequest 结构体（借书请求数据）
type BorrowRequest struct {
	UserID int `json:"userId"`
	BookID int `json:"bookId"`
}

// BorrowBook 处理借书请求
// 1. 检查 Books.available_copies 是否 > 0 (Check if Books.available_copies > 0
// 2. 如果可借 -> BorrowingRecords 插入一条记录(借阅日期, 到期日)(If available -> BorrowingRecords insert a record (Borrowing Date, Expiry Date)
// 3. 更新 Books.available_copies-(Update Books.available_copies -)
func BorrowBook(w http.ResponseWriter, r *http.Request) {
	var request BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// 1) 检查库存 check book
	var availableCopies int
	err := config.DB.QueryRow("SELECT available_copies FROM Books WHERE id = ?", request.BookID).Scan(&availableCopies)
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

	// 2) 记录借书信息/Record book borrowing information
	borrowedAt := time.Now()
	dueDate := borrowedAt.AddDate(0, 0, 14) // 借阅时间 + 14 天/Borrowing time + 14 days

	_, err = config.DB.Exec(
		"INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)",
		request.UserID, request.BookID, borrowedAt, dueDate,
	)
	if err != nil {
		log.Println("Error inserting borrowing record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 3) 更新库存/Update Inventory
	_, err = config.DB.Exec("UPDATE Books SET available_copies = available_copies - 1 WHERE id = ?", request.BookID)
	if err != nil {
		log.Println("Error updating book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Book borrowed successfully",
		"dueDate": dueDate,
	})
}

// ReturnBook 处理还书请求
// 1. 查找 BorrowingRecords 中 userId + bookId + 未归还的记录
// 2. 更新 returned_at
// 3. 更新 Books.available_copies++

// ReturnBook handles the book return request
// 1. Find userId + bookId + unreturned records in BorrowingRecords.
// 2. Update returned_at
// 3. Update the Books.available_copies++ file.
func ReturnBook(w http.ResponseWriter, r *http.Request) {
	var request BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// 1) 查找未归还的借阅记录
	// 1) Find unreturned loan records
	var recordID int
	var dueDate time.Time
	err := config.DB.QueryRow(
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

	// 2) 更新 returned_at
	// 2) Update returned_at
	returnedAt := time.Now()
	_, err = config.DB.Exec("UPDATE BorrowingRecords SET returned_at = ? WHERE id = ?", returnedAt, recordID)
	if err != nil {
		log.Println("Error updating borrow record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 3) 更新库存
	// 3) Update inventory
	_, err = config.DB.Exec("UPDATE Books SET available_copies = available_copies + 1 WHERE id = ?", request.BookID)
	if err != nil {
		log.Println("Error updating book availability:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// 4) 计算逾期费用（如果有的话）
	// 4) Calculation of late fees (if any)
	overdueDays := 0
	fine := 0
	if returnedAt.After(dueDate) {
		overdueDays = int(returnedAt.Sub(dueDate).Hours() / 24)
		fine = overdueDays * 1 // 假设每天罚款 1 元
		// Assuming a fine of $1 per day
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "Book returned successfully",
		"overdueDays": overdueDays,
		"fine":        fine,
	})
}
