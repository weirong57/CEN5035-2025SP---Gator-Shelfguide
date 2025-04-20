package controllers_test

import (
	"bytes"
	
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/config"
	"library-backend/controllers"
	"library-backend/models"
)

func setupReviewTest(t *testing.T, db *sql.DB) (userID, bookID int) {
	// 插入用户
	res, err := db.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)", "test_reviewer", "123456", "user")
	if err != nil {
		t.Fatalf("插入测试用户失败: %v", err)
	}
	uid, _ := res.LastInsertId()

	// 插入图书
	res, err = db.Exec("INSERT INTO Books (title, author, available_copies) VALUES (?, ?, ?)", "Test Book", "Test Author", 1)
	if err != nil {
		t.Fatalf("插入测试图书失败: %v", err)
	}
	bid, _ := res.LastInsertId()

	// 插入借阅记录
	_, err = db.Exec("INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))", uid, bid)
	if err != nil {
		t.Fatalf("插入借阅记录失败: %v", err)
	}

	return int(uid), int(bid)
}

func teardownReviewTest(t *testing.T, db *sql.DB, userID, bookID int) {
	db.Exec("DELETE FROM Reviews WHERE user_id = ? AND book_id = ?", userID, bookID)
	db.Exec("DELETE FROM BorrowingRecords WHERE user_id = ? AND book_id = ?", userID, bookID)
	db.Exec("DELETE FROM Books WHERE id = ?", bookID)
	db.Exec("DELETE FROM Users WHERE id = ?", userID)
}

func TestAddReview_Success(t *testing.T) {
	userID, bookID := setupReviewTest(t, config.DB)
	defer teardownReviewTest(t, config.DB, userID, bookID)

	review := models.ReviewRequest{
		UserID:  userID,
		BookID:  bookID,
		Rating:  4,
		Comment: "Good book!",
	}
	data, _ := json.Marshal(review)

	req := httptest.NewRequest("POST", "/reviews", bytes.NewReader(data))
	rec := httptest.NewRecorder()

	controllers.AddReview(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("期待状态码 200，实际为: %d", rec.Code)
	}
}
