package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// ReservationRoutes handles book reservation related routes
func ReservationRoutes(router *mux.Router) {
	// Create a new reservation
	router.HandleFunc("/api/reservations", controllers.CreateReservation).Methods(http.MethodPost)
	router.HandleFunc("/api/reservations/cancel", controllers.CancelReservation).Methods(http.MethodPost)
	router.HandleFunc("/api/reservations", controllers.GetUserReservations).Methods(http.MethodGet)
}
