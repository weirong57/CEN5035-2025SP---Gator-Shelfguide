package controllers_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/controllers"
)

func TestGetAllBooks_DefaultPagination(t *testing.T) {
	req := httptest.NewRequest("GET", "/books", nil)
	rec := httptest.NewRecorder()

	controllers.GetAllBooks(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("期望状态码 200，但实际为 %d", rec.Code)
	}
}
