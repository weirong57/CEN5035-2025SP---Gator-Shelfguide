package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// ReviewRoutes handles book review related routes
func ReviewRoutes(router *mux.Router) {
	// Add review route: POST method to /reviews
	router.HandleFunc("/reviews", controllers.AddReview).Methods(http.MethodPost)
	
	// Get reviews route: GET method to /reviews/{bookId}
	// This allows you to get reviews for a specific book by ID
	router.HandleFunc("/reviews/{bookId}", controllers.GetBookReviews).Methods(http.MethodGet)
}
