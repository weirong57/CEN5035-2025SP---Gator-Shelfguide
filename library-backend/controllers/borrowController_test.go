package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/config"
	"library-backend/models"
)

// **测试借书 Test to borrow books **
func TestBorrowBook(t *testing.T) {
	config.DB.Exec("INSERT INTO Books (title, author, available_copies) VALUES ('Test Book', 'Test Author', 1)")
	config.DB.Exec("INSERT INTO Users (username, password, role) VALUES ('testuser', 'testpass', 'user')")

	borrowRequest := models.BorrowRequest{UserID: 1, BookID: 1}
	borrowJSON, _ := json.Marshal(borrowRequest)
	req, _ := http.NewRequest("POST", "/borrow", bytes.NewBuffer(borrowJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(BorrowBook)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("❌ Expected status code %v，Actual status code %v", http.StatusOK, rr.Code)
	}
}
