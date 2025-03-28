package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
)

type ReviewRequest struct {
	UserID  int    `json:"userId"`
	BookID  int    `json:"bookId"`
	Rating  int    `json:"rating"`
	Comment string `json:"comment"`
}

// AddReview handles the creation of a new review
func AddReview(w http.ResponseWriter, r *http.Request) {
	var request ReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// Validate rating
	if request.Rating < 1 || request.Rating > 5 {
		http.Error(w, "Rating must be between 1 and 5", http.StatusBadRequest)
		return
	}

	// Start transaction
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("Failed to start transaction:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback()

	// Check if user has borrowed the book
	var borrowCount int
	err = tx.QueryRow("SELECT COUNT(*) FROM BorrowingRecords WHERE user_id = ? AND book_id = ?",
		request.UserID, request.BookID).Scan(&borrowCount)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if borrowCount == 0 {
		http.Error(w, "You can only review books you have borrowed", http.StatusForbidden)
		return
	}

	// Check for existing review
	var existingReview int
	err = tx.QueryRow("SELECT COUNT(*) FROM Reviews WHERE user_id = ? AND book_id = ?",
		request.UserID, request.BookID).Scan(&existingReview)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if existingReview > 0 {
		http.Error(w, "You have already reviewed this book", http.StatusConflict)
		return
	}

	// Insert review
	_, err = tx.Exec(
		"INSERT INTO Reviews (user_id, book_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)",
		request.UserID, request.BookID, request.Rating, request.Comment, time.Now(),
	)
	if err != nil {
		log.Println("Error creating review:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		log.Println("Transaction commit failed:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Review added successfully",
	})
}

// GetBookReviews retrieves all reviews for a specific book
func GetBookReviews(w http.ResponseWriter, r *http.Request) {
	bookID := r.URL.Query().Get("bookId")
	if bookID == "" {
		http.Error(w, "Book ID is required", http.StatusBadRequest)
		return
	}

	rows, err := config.DB.Query(`
        SELECT r.rating, r.comment, r.created_at, u.username 
        FROM Reviews r 
        JOIN Users u ON r.user_id = u.id 
        WHERE r.book_id = ?`,
		bookID)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var reviews []map[string]interface{}
	for rows.Next() {
		var rating int
		var comment string
		var createdAt time.Time
		var username string

		if err := rows.Scan(&rating, &comment, &createdAt, &username); err != nil {
			log.Println("Error scanning review:", err)
			continue
		}

		reviews = append(reviews, map[string]interface{}{
			"rating":    rating,
			"comment":   comment,
			"createdAt": createdAt,
			"username":  username,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}
