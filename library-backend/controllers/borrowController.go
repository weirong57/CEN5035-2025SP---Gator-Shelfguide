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
// BorrowBook 借阅图书 (Borrow a Book)
func BorrowBook(w http.ResponseWriter, r *http.Request) {
	log.Println("📥 BorrowBook called")

	// 从请求上下文中获取 userId
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		log.Println("❌ 无法获取用户ID")
		http.Error(w, "User ID not found", http.StatusUnauthorized)
		return
	}

	// 1. 解析客户端发送的 JSON 请求体
	var request models.BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Println("❌ 请求体解析失败:", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	log.Printf("📨 接收到借阅请求：user_id=%d, book_id=%d\n", userID, request.BookID)

	request.UserID = userID
	
	// 2. 启动数据库事务
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("❌ 启动事务失败:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// 3. 查询目标图书是否存在，并获取剩余库存
	var availableCopies int
	err = tx.QueryRow("SELECT available_copies FROM Books WHERE id = ?", request.BookID).Scan(&availableCopies)
	if err == sql.ErrNoRows {
		log.Println("⚠️ 图书不存在")
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("❌ 查询图书库存出错:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Printf("📦 当前库存数量：%d\n", availableCopies)

	// 4. 判断是否还有库存
	if availableCopies < 1 {
		log.Println("⚠️ 库存不足，无法借阅")
		http.Error(w, "No copies available", http.StatusBadRequest)
		return
	}

	// 5. 扣除库存（使用乐观锁方式）
	result, err := tx.Exec("UPDATE Books SET available_copies = available_copies - 1 WHERE id = ? AND available_copies > 0", request.BookID)
	if err != nil {
		log.Println("❌ 扣除库存失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Println("❌ 获取库存更新结果失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if rowsAffected == 0 {
		log.Println("⚠️ 库存已被其他用户抢先借走")
		http.Error(w, "No copies available", http.StatusBadRequest)
		return
	}
	log.Println("✅ 库存扣除成功")

	// 6. 插入借阅记录（借阅时间为当前，归还期限为 14 天后）
	borrowedAt := time.Now()
	dueDate := borrowedAt.AddDate(0, 0, 14)
	_, err = tx.Exec(
		"INSERT INTO borrowingrecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, ?, ?)",
		userID, request.BookID, borrowedAt, dueDate, // 使用 userID 替代 request.UserID
	)
	if err != nil {
		log.Println("❌ 插入借阅记录失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Println("✅ 借阅记录插入成功")

	// 7. 提交事务
	if err := tx.Commit(); err != nil {
		log.Println("❌ 事务提交失败:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}
	log.Println("✅ 借阅事务提交成功")

	// 8. 返回成功响应（结构封装）
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "Book borrowed successfully",
		"data": map[string]interface{}{
			"dueDate": dueDate.Format("2006-01-02 15:04:05"),
		},
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
// ReturnBook 归还图书 (Return a Book)
func ReturnBook(w http.ResponseWriter, r *http.Request) {
	log.Println("📩 ReturnBook controller triggered")

	// 从请求上下文中获取 userId
	userID, ok := r.Context().Value("userID").(int)
	if !ok {
		log.Println("❌ 无法获取用户ID")
		http.Error(w, "User ID not found", http.StatusUnauthorized)
		return
	}

	var request models.BorrowRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Println("❌ Failed to decode return request:", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	log.Printf("🔁 接收到还书请求：user_id=%d, book_id=%d\n", userID, request.BookID)

	// Start a transaction
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("❌ Failed to start transaction:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Find the active borrowing record
	var recordID int
	var dueDate time.Time
	err = tx.QueryRow(
		"SELECT id, due_date FROM borrowingrecords WHERE user_id = ? AND book_id = ? AND returned_at IS NULL ORDER BY borrowed_at DESC LIMIT 1",
		userID, request.BookID, // 使用 userID 替代 request.UserID
	).Scan(&recordID, &dueDate)

	if err == sql.ErrNoRows {
		log.Println("⚠️ No active borrow record found")
		http.Error(w, "No active borrow record found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("❌ Database error on finding borrow record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Printf("📘 找到借阅记录 ID=%d，应还时间=%v\n", recordID, dueDate)

	// Update returned_at timestamp
	returnedAt := time.Now()
	_, err = tx.Exec("UPDATE borrowingrecords SET returned_at = ? WHERE id = ?", returnedAt, recordID)
	if err != nil {
		log.Println("❌ Failed to update borrow record:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Println("✅ 借阅记录已更新为已归还")

	// Update book availability
	_, err = tx.Exec("UPDATE Books SET available_copies = available_copies + 1 WHERE id = ?", request.BookID)
	if err != nil {
		log.Println("❌ Failed to update book stock:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	log.Println("✅ 图书库存已增加")

	// Calculate overdue days and fine
	overdueDays := 0
	fine := 0
	if returnedAt.After(dueDate) {
		overdueDays = int(returnedAt.Sub(dueDate).Hours() / 24)
		fine = overdueDays * 1 // Assume $1 fine per day
		log.Printf("⚠️ 已逾期 %d 天，应缴罚金：%d\n", overdueDays, fine)
	}else {
		log.Println("✅ 未逾期，无需罚金")
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Println("❌ Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}
	log.Println("✅ 还书事务已提交")

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message":     "Book returned successfully",
		"overdueDays": overdueDays,
		"fine":        fine,
	})
}
