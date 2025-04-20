package controllers_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/config"
	"library-backend/controllers"
	"library-backend/models"
)

func setupBorrowTest(t *testing.T) (userID, bookID int) {
	// 添加用户
	res, err := config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)", "borrow_user", "123456", "user")
	if err != nil {
		t.Fatalf("添加用户失败: %v", err)
	}
	uid, _ := res.LastInsertId()

	// 添加图书（可借数量 = 2）
	res, err = config.DB.Exec("INSERT INTO Books (title, author, available_copies) VALUES (?, ?, ?)", "Borrowable Book", "Author A", 2)
	if err != nil {
		t.Fatalf("添加图书失败: %v", err)
	}
	bid, _ := res.LastInsertId()

	return int(uid), int(bid)
}

func teardownBorrowTest(t *testing.T, userID, bookID int) {
	config.DB.Exec("DELETE FROM BorrowingRecords WHERE user_id = ? AND book_id = ?", userID, bookID)
	config.DB.Exec("DELETE FROM Books WHERE id = ?", bookID)
	config.DB.Exec("DELETE FROM Users WHERE id = ?", userID)
}

func TestBorrowBook_Success(t *testing.T) {
	userID, bookID := setupBorrowTest(t)
	defer teardownBorrowTest(t, userID, bookID)

	request := models.BorrowRequest{
		BookID: bookID,
	}
	data, _ := json.Marshal(request)

	req := httptest.NewRequest("POST", "/borrow", bytes.NewReader(data))
	// 模拟 context 中的 userID
	ctx := context.WithValue(req.Context(), "userID", userID)
	req = req.WithContext(ctx)
	rec := httptest.NewRecorder()

	controllers.BorrowBook(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("期望状态码 200，但实际为 %d", rec.Code)
	}
}
