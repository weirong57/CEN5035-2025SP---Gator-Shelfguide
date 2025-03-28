package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// ReviewRoutes handles book review related routes
func ReviewRoutes(router *mux.Router) {
	//  @Summary        Add a Book Review
	//  @Description    Users can add a review for a borrowed book
	//  @Tags          Review Management
	//  @Accept        json
	//  @Produce       json
	//  @Param         reviewRequest    body        controllers.ReviewRequest    true    "Review Request"
	//  @Success       201             {object}    map[string]string           "Success Response"
	//  @Router        /reviews [post]
	router.HandleFunc("/reviews", controllers.AddReview).Methods(http.MethodPost)

	//  @Summary        Get Book Reviews
	//  @Description    Get all reviews for a specific book
	//  @Tags          Review Management
	//  @Produce       json
	//  @Param         bookId    query     string    true    "Book ID"
	//  @Success       200       {array}   object    "Array of reviews"
	//  @Router        /reviews [get]
	router.HandleFunc("/reviews", controllers.GetBookReviews).Methods(http.MethodGet)
}
