package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
)

// ReservationRequest represents a reservation request structure / ReservationRequest 表示预约请求结构体
type ReservationRequest struct {
	UserID int `json:"userId"` // User ID / 用户ID
	BookID int `json:"bookId"` // Book ID / 书籍ID
}

// CreateReservation handles book reservation requests

// @Summary      Create a reservation
// @Description  Create a new book reservation for a user
// @Tags         Reservation
// @Accept       json
// @Produce      json
// @Param        reservation  body  controllers.ReservationRequest  true  "Reservation Request"
// @Success      200  {object}  map[string]string  "Reservation created successfully"
// @Failure      400  {string}  string  "Invalid request data"
// @Failure      404  {string}  string  "Book not found"
// @Failure      409  {string}  string  "You already have an active reservation for this book"
// @Failure      500  {string}  string  "Database error or transaction error"
// @Router       /reservations [post]

func CreateReservation(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into the ReservationRequest struct / 将请求体解码到 ReservationRequest 结构体中
	var request ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Start a new database transaction / 开启一个新的数据库事务
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("Failed to start transaction:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	// Ensure the transaction rolls back if commit fails / 如果提交失败则确保回滚事务
	defer tx.Rollback()

	// Check if the book exists and is available by querying the number of available copies / 通过查询可用副本数来检查书籍是否存在且可用
	var availableCopies int
	err = tx.QueryRow("SELECT available_copies FROM Books WHERE id = ?", request.BookID).Scan(&availableCopies)
	if err == sql.ErrNoRows {
		http.Error(w, "Book not found", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Check if the user already has an active (PENDING) reservation for this book / 检查用户是否已经对此书有一个未处理(PENDING)的预约
	var existingReservation int
	err = tx.QueryRow(`
        SELECT COUNT(*) FROM Reservations 
        WHERE user_id = ? AND book_id = ? AND status = 'PENDING'`,
		request.UserID, request.BookID).Scan(&existingReservation)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if existingReservation > 0 {
		http.Error(w, "You already have an active reservation for this book", http.StatusConflict)
		return
	}

	// Insert a new reservation record with status 'PENDING' / 插入一条新的预约记录，状态设为 'PENDING'
	_, err = tx.Exec(`
        INSERT INTO Reservations (user_id, book_id, status, created_at) 
        VALUES (?, ?, 'PENDING', ?)`,
		request.UserID, request.BookID, time.Now())
	if err != nil {
		log.Println("Error creating reservation:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Commit the transaction / 提交事务
	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	// Return a success message in JSON format / 返回 JSON 格式的成功信息
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reservation created successfully",
	})
}

// CancelReservation handles reservation cancellation requests

// @Summary      Cancel a reservation
// @Description  Cancel an existing reservation for a book
// @Tags         Reservation
// @Accept       json
// @Produce      json
// @Param        reservation  body  controllers.ReservationRequest  true  "Reservation Request"
// @Success      200  {object}  map[string]string  "Reservation cancelled successfully"
// @Failure      400  {string}  string  "Invalid request data"
// @Failure      404  {string}  string  "No active reservation found"
// @Failure      500  {string}  string  "Database error"
// @Router       /reservations/cancel [post]

func CancelReservation(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into the ReservationRequest struct / 将请求体解码到 ReservationRequest 结构体中
	var request ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Update the reservation's status to 'CANCELLED' and record the update time / 更新预约状态为 'CANCELLED' 并记录更新时间
	result, err := config.DB.Exec(`
        UPDATE Reservations 
        SET status = 'CANCELLED', updated_at = ? 
        WHERE user_id = ? AND book_id = ? AND status = 'PENDING'`,
		time.Now(), request.UserID, request.BookID)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Check if any reservation was affected by the update / 检查是否有预约记录被更新
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "No active reservation found", http.StatusNotFound)
		return
	}

	// Return a success message in JSON format / 返回 JSON 格式的成功信息
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reservation cancelled successfully",
	})
}

// GetUserReservations retrieves all reservations for a given user // 获取指定用户的所有预约记录

// @Summary      Get user reservations
// @Description  Retrieve all reservation records for a specific user
// @Tags         Reservation
// @Accept       json
// @Produce      json
// @Param        userId  query  string  true  "User ID"
// @Success      200  {array}  map[string]interface{}  "List of reservations"
// @Failure      400  {string}  string  "User ID is required"
// @Failure      500  {string}  string  "Database error"
// @Router       /reservations [get]

func GetUserReservations(w http.ResponseWriter, r *http.Request) {
	// Extract the userId from the URL query parameters / 从 URL 查询参数中提取 userId
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	// Query the database for all reservations of the user, joining the Books table to include book titles / 查询该用户的所有预约记录，并通过联接 Books 表来包含书名信息
	rows, err := config.DB.Query(`
        SELECT r.id, r.book_id, b.title, r.status, r.created_at, r.updated_at
        FROM Reservations r
        JOIN Books b ON r.book_id = b.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC`,
		userID)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Create a slice to hold the reservation records / 创建一个切片来存储预约记录
	var reservations []map[string]interface{}
	for rows.Next() {
		var id int
		var bookID int
		var title string
		var status string
		var createdAt, updatedAt time.Time

		// Scan the row data into variables / 将行数据扫描到变量中
		if err := rows.Scan(&id, &bookID, &title, &status, &createdAt, &updatedAt); err != nil {
			log.Println("Error scanning reservation:", err)
			continue
		}

		// Append the reservation data to the slice / 将预约数据添加到切片中
		reservations = append(reservations, map[string]interface{}{
			"id":        id,
			"bookId":    bookID,
			"title":     title,
			"status":    status,
			"createdAt": createdAt,
			"updatedAt": updatedAt,
		})
	}

	// Return the reservations as a JSON response / 以 JSON 格式返回预约记录
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}
