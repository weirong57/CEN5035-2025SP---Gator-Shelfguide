package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// ReservationRoutes handles book reservation related routes
func ReservationRoutes(router *mux.Router) {
	// Create a new reservation
	router.HandleFunc("/reservations", controllers.CreateReservation).Methods(http.MethodPost)

	// Cancel a reservation
	router.HandleFunc("/reservations/cancel", controllers.CancelReservation).Methods(http.MethodPost)

	// Get user's reservations
	router.HandleFunc("/reservations", controllers.GetUserReservations).Methods(http.MethodGet)
}
