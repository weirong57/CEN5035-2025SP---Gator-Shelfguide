package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// AuthRoutes 设置认证相关的路由 / Set authentication-related routes
func AuthRoutes(router *mux.Router) {

	router.HandleFunc("/register", controllers.RegisterUser).Methods(http.MethodPost)
	router.HandleFunc("/login", controllers.LoginUser).Methods(http.MethodPost)
}
