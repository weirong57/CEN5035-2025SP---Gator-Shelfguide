package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

// **测试添加书籍 Test Add books **
func TestAddBook(t *testing.T) {
	book := Book{
		Title:           "New Book",
		Author:          "New Author",
		Genre:           "Fantasy",
		Language:        "English",
		ShelfNumber:     "B-202",
		AvailableCopies: 5,
		ISBN:            "9876543210",
	}

	bookJSON, _ := json.Marshal(book)
	req, _ := http.NewRequest("POST", "/books", bytes.NewBuffer(bookJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(AddBook)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("❌ Expected status code %v，Actual status code %v", http.StatusCreated, rr.Code)
	}
}
