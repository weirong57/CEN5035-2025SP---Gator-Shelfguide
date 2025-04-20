package routes

import (
	"library-backend/controllers"
	"net/http"
	"log" 
	"library-backend/middleware" // 导入中间件包
	"github.com/gorilla/mux"
)

// BorrowRoutes 处理借书和还书的路由 / Handle book borrowing and returning routes
func BorrowRoutes(router *mux.Router) {

	log.Println("📌 Registering /api/borrow and /api/borrow/return routes") 
	router.Handle("/borrow", middleware.VerifyToken(http.HandlerFunc(controllers.BorrowBook))).Methods(http.MethodPost)
	router.Handle("/borrow/return", middleware.VerifyToken(http.HandlerFunc(controllers.ReturnBook))).Methods(http.MethodPost)
}
