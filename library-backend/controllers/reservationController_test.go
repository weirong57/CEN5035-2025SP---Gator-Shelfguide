package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/models"
)

func TestCreateReservation(t *testing.T) {
	tests := []struct {
		name           string
		request        models.ReservationRequest
		expectedStatus int
	}{
		{
			name: "Valid Reservation",
			request: models.ReservationRequest{
				UserID: 1,
				BookID: 1,
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "Invalid Book ID",
			request: models.ReservationRequest{
				UserID: 1,
				BookID: 999999, // 不存在的图书 ID
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			jsonBody, _ := json.Marshal(tt.request)
			req := httptest.NewRequest("POST", "/reservations", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")
			rr := httptest.NewRecorder()

			CreateReservation(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("[%s] ❌ Expected status %d, got %d", tt.name, tt.expectedStatus, rr.Code)
			}
		})
	}
}
