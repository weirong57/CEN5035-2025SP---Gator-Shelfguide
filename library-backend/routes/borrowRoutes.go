package routes

import (
	"library-backend/controllers"
	"net/http"
	"log" 
	"github.com/gorilla/mux"
)

// BorrowRoutes 处理借书和还书的路由 / Handle book borrowing and returning routes
func BorrowRoutes(router *mux.Router) {

	log.Println("📌 Registering /api/borrow and /api/borrow/return routes") 
	router.HandleFunc("/borrow", controllers.BorrowBook).Methods(http.MethodPost)
	router.HandleFunc("/borrow/return", controllers.ReturnBook).Methods(http.MethodPost)
}
