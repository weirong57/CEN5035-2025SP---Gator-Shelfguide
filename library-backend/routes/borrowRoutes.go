package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// BorrowRoutes 处理借书和还书的路由 / Handle book borrowing and returning routes
func BorrowRoutes(router *mux.Router) {
	router.HandleFunc("/api/borrow", controllers.BorrowBook).Methods(http.MethodPost)
	router.HandleFunc("/api/borrow/return", controllers.ReturnBook).Methods(http.MethodPost)
}
