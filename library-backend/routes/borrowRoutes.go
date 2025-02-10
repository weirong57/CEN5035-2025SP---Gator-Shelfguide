package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// BorrowRoutes 处理借书和还书的路由
func BorrowRoutes(router *mux.Router) {
	// 借书
	router.HandleFunc("/borrow", controllers.BorrowBook).Methods(http.MethodPost)

	// 还书
	router.HandleFunc("/borrow/return", controllers.ReturnBook).Methods(http.MethodPost)
}
