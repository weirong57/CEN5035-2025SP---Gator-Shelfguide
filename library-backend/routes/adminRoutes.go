package routes

import (
	"library-backend/controllers"
	"library-backend/middleware"

	"github.com/gorilla/mux"
)

// RegisterAdminRoutes 设置管理员相关的路由
func RegisterAdminRoutes(router *mux.Router) {
	adminRouter := router.PathPrefix("/admin").Subrouter()
	adminRouter.Use(middleware.VerifyToken)
	adminRouter.Use(middleware.IsAdmin)

	// 仅保留管理员添加与删除图书功能
	adminRouter.HandleFunc("/books", controllers.AddBook).Methods("POST")
	adminRouter.HandleFunc("/books/{id}", controllers.DeleteBook).Methods("DELETE")
}
