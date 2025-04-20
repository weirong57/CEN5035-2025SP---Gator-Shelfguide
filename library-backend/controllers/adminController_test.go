package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/controllers"
	"library-backend/models"
)

func TestAddBook_Success(t *testing.T) {
	book := models.Book{
		Title:           "Admin Added Book",
		Author:          "Admin Author",
		Genre:           "Test Genre",
		Language:        "English",
		ShelfNumber:     "A1",
		AvailableCopies: 3,
		ISBN:            "1234567890",
	}
	data, _ := json.Marshal(book)

	req := httptest.NewRequest("POST", "/admin/books", bytes.NewReader(data))
	rec := httptest.NewRecorder()

	controllers.AddBook(rec, req)

	if rec.Code != http.StatusCreated {
		t.Errorf("期望状态码 201，实际为 %d", rec.Code)
	}
}
