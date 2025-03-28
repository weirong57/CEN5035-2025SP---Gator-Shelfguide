package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"library-backend/config"
)

func TestAddReview(t *testing.T) {
	// Initialize test database connection
	if err := config.InitDB(); err != nil {
		t.Fatalf("Failed to initialize database: %v", err)
	}

	// Test cases
	tests := []struct {
		name           string
		reviewRequest  ReviewRequest
		expectedStatus int
	}{
		{
			name: "Valid Review",
			reviewRequest: ReviewRequest{
				UserID:  1,
				BookID:  1,
				Rating:  5,
				Comment: "Great book!",
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "Invalid Rating",
			reviewRequest: ReviewRequest{
				UserID:  1,
				BookID:  1,
				Rating:  6, // Invalid rating > 5
				Comment: "Great book!",
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name: "Missing Required Fields",
			reviewRequest: ReviewRequest{
				UserID: 1,
				// Missing BookID
				Rating:  4,
				Comment: "Good book",
			},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create request body
			jsonBody, err := json.Marshal(tt.reviewRequest)
			if err != nil {
				t.Fatalf("Failed to marshal request: %v", err)
			}

			// Create request
			req := httptest.NewRequest("POST", "/reviews", bytes.NewBuffer(jsonBody))
			req.Header.Set("Content-Type", "application/json")

			// Create response recorder
			rr := httptest.NewRecorder()

			// Call the handler
			AddReview(rr, req)

			// Check status code
			if rr.Code != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, tt.expectedStatus)
			}
		})
	}
}

func TestGetBookReviews(t *testing.T) {
	// Initialize test database connection
	if err := config.InitDB(); err != nil {
		t.Fatalf("Failed to initialize database: %v", err)
	}

	// Test cases
	tests := []struct {
		name           string
		bookID         string
		expectedStatus int
	}{
		{
			name:           "Valid Book ID",
			bookID:         "1",
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Missing Book ID",
			bookID:         "",
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:           "Invalid Book ID",
			bookID:         "999999",      // Assuming this ID doesn't exist
			expectedStatus: http.StatusOK, // Should return empty array, not error
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Create request
			req := httptest.NewRequest("GET", "/reviews?bookId="+tt.bookID, nil)

			// Create response recorder
			rr := httptest.NewRecorder()

			// Call the handler
			GetBookReviews(rr, req)

			// Check status code
			if rr.Code != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, tt.expectedStatus)
			}
		})
	}
}
