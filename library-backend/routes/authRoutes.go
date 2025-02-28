package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// AuthRoutes 设置认证相关的路由 / Set authentication-related routes
func AuthRoutes(router *mux.Router) {
	//	@Summary		用户注册 / User Registration
	//	@Description	允许用户注册新账号 / Allows users to register a new account
	//	@Tags			认证 / Authentication
	//	@Accept			json
	//	@Produce		json
	//	@Param			user	body		controllers.User	true	"用户信息 / User Information"
	//	@Success		201		{object}	map[string]string	"成功响应 / Success Response"
	//	@Router			/register [post]
	router.HandleFunc("/register", controllers.RegisterUser).Methods(http.MethodPost)

	//	@Summary		用户登录 / User Login
	//	@Description	允许用户登录并获取 JWT 令牌 / Allows users to log in and receive a JWT token
	//	@Tags			认证 / Authentication
	//	@Accept			json
	//	@Produce		json
	//	@Param			credentials	body		controllers.Credentials	true	"用户登录信息 / User Login Credentials"
	//	@Success		200			{object}	map[string]string		"成功响应 / Success Response"
	//	@Router			/login [post]
	router.HandleFunc("/login", controllers.LoginUser).Methods(http.MethodPost)
}
