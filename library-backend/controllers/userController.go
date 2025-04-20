package controllers

import (
	"database/sql"
	"encoding/json"
	
	"log"
	"net/http"
	"strconv"

	"library-backend/config"
	"library-backend/models"

	"github.com/gorilla/mux"
)

// GetUserProfile 获取用户基本信息（用户名、注册时间）
// @Summary 获取用户信息 (Retrieve user profile)
// @Description 根据用户 ID 获取用户名和注册时间 (Get username and registration time by user ID)
// @Tags 用户管理 (User Management)
// @Accept json
// @Produce json
// @Param id path int true "用户 ID (User ID)"
// @Success 200 {object} models.User "成功响应 (Success Response)"
// @Failure 400 {object} map[string]string "无效用户 ID (Invalid user ID)"
// @Failure 404 {object} map[string]string "用户未找到 (User not found)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /users/{id} [get]
func GetUserProfile(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	log.Printf("🔍 获取用户信息: user_id = %d\n", userId)

	var user models.User
	err = config.DB.QueryRow("SELECT id, username, created_at FROM users WHERE id = ?", userId).
		Scan(&user.ID, &user.Username, &user.CreatedAt)
	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("❌ 查询用户失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ 用户信息查询成功: %+v\n", user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// GetUserBorrowingRecords 获取用户借阅历史（含图书信息）
// @Summary 获取用户借阅记录 (Retrieve user borrowing history)
// @Description 获取用户的借阅历史记录，包括书名、作者、ISBN、借阅时间等 (Get user's borrowing history with book details)
// @Tags 用户管理 (User Management)
// @Accept json
// @Produce json
// @Param id path int true "用户 ID (User ID)"
// @Success 200 {array} models.BorrowingRecord "借阅记录列表 (Borrowing records list)"
// @Failure 400 {object} map[string]string "无效用户 ID (Invalid user ID)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /users/{id}/records [get]
func GetUserBorrowingRecords(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	log.Printf("📚 查询用户借阅记录: user_id = %d\n", userId)

	// 修改查询，返回所有借阅记录
	query := `
		SELECT b.id, b.title, b.author, b.isbn, br.borrowed_at, br.due_date, br.returned_at
		FROM borrowingrecords br
		JOIN books b ON br.book_id = b.id
		WHERE br.user_id = ?
		ORDER BY br.borrowed_at DESC`

	rows, err := config.DB.Query(query, userId)
	if err != nil {
		log.Println("❌ 查询借阅记录失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	records := []models.BorrowingRecord{}
	for rows.Next() {
		record := models.BorrowingRecord{}
		err := rows.Scan(&record.BookID, &record.Title, &record.Author, &record.ISBN,
			&record.BorrowedAt, &record.DueDate, &record.ReturnedAt)
		if err != nil {
			log.Println("❌ 行扫描失败:", err)
			continue
		}

		// 判断是否已归还
		if record.ReturnedAt.Valid {
			record.Status = "Returned" // 已归还
		} else {
			record.Status = "Borrowing" // 当前借阅
		}

		records = append(records, record)
	}

	log.Printf("✅ 查询到 %d 条借阅记录\n", len(records))
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(records)
}
