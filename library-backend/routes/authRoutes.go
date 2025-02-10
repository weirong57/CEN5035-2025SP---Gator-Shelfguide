package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// 设置认证相关的路由
// Set authentication-related routes
func AuthRoutes(router *mux.Router) {
	// 注册用户
	// Register a new user
	router.HandleFunc("/register", controllers.RegisterUser).Methods(http.MethodPost)

	// 用户登录
	// User login
	router.HandleFunc("/login", controllers.LoginUser).Methods(http.MethodPost)
}
