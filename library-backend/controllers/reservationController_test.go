package controllers

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"

    "library-backend/config"
)

func TestCreateReservation(t *testing.T) {
    if err := config.InitDB(); err != nil {
        t.Fatalf("Failed to initialize database: %v", err)
    }

    tests := []struct {
        name           string
        request       ReservationRequest
        expectedStatus int
    }{
        {
            name: "Valid Reservation",
            request: ReservationRequest{
                UserID: 1,
                BookID: 1,
            },
            expectedStatus: http.StatusOK,
        },
        {
            name: "Invalid Book ID",
            request: ReservationRequest{
                UserID: 1,
                BookID: 999999,
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
                t.Errorf("handler returned wrong status code: got %v want %v",
                    rr.Code, tt.expectedStatus)
            }
        })
    }
}
