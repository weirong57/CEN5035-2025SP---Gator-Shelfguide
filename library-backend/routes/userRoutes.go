package routes

import (
	"library-backend/controllers"
	"github.com/gorilla/mux"
	"net/http"
)

// UserRoutes 定义与用户相关的路由
func UserRoutes(r *mux.Router) {
	// 获取用户基本信息
	r.HandleFunc("/users/{id}", controllers.GetUserProfile).Methods(http.MethodGet)
	
	// 获取用户借阅历史
	r.HandleFunc("/users/{id}/borrowings", controllers.GetUserBorrowingRecords).Methods(http.MethodGet)
}
