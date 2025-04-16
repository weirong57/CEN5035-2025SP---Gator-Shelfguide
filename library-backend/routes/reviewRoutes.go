package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// ReviewRoutes handles book review related routes
func ReviewRoutes(router *mux.Router) {
	router.HandleFunc("/api/reviews", controllers.AddReview).Methods(http.MethodPost)
	router.HandleFunc("/api/reviews", controllers.GetBookReviews).Methods(http.MethodGet)
}
