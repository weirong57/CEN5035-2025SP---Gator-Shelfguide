package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
)

type ReservationRequest struct {
	UserID int `json:"userId"`
	BookID int `json:"bookId"`
}

// CreateReservation handles book reservation requests
func CreateReservation(w http.ResponseWriter, r *http.Request) {
	var request ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("Failed to start transaction:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Check if book exists and is available
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

	// Check if user already has an active reservation for this book
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

	// Create reservation
	_, err = tx.Exec(`
        INSERT INTO Reservations (user_id, book_id, status, created_at) 
        VALUES (?, ?, 'PENDING', ?)`,
		request.UserID, request.BookID, time.Now())
	if err != nil {
		log.Println("Error creating reservation:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reservation created successfully",
	})
}

// CancelReservation handles reservation cancellation
func CancelReservation(w http.ResponseWriter, r *http.Request) {
	var request ReservationRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

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

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "No active reservation found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Reservation cancelled successfully",
	})
}

// GetUserReservations retrieves all reservations for a user
func GetUserReservations(w http.ResponseWriter, r *http.Request) {
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

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

	var reservations []map[string]interface{}
	for rows.Next() {
		var id int
		var bookID int
		var title string
		var status string
		var createdAt, updatedAt time.Time

		if err := rows.Scan(&id, &bookID, &title, &status, &createdAt, &updatedAt); err != nil {
			log.Println("Error scanning reservation:", err)
			continue
		}

		reservations = append(reservations, map[string]interface{}{
			"id":        id,
			"bookId":    bookID,
			"title":     title,
			"status":    status,
			"createdAt": createdAt,
			"updatedAt": updatedAt,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}
