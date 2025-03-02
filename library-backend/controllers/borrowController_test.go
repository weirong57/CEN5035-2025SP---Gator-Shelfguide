package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/config"
)

// **测试借书**
func TestBorrowBook(t *testing.T) {
	config.DB.Exec("INSERT INTO Books (title, author, available_copies) VALUES ('Test Book', 'Test Author', 1)")
	config.DB.Exec("INSERT INTO Users (username, password, role) VALUES ('testuser', 'testpass', 'user')")

	borrowRequest := BorrowRequest{UserID: 1, BookID: 1}
	borrowJSON, _ := json.Marshal(borrowRequest)
	req, _ := http.NewRequest("POST", "/borrow", bytes.NewBuffer(borrowJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(BorrowBook)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("❌ 期望状态码 %v，实际状态码 %v", http.StatusOK, rr.Code)
	}
}
