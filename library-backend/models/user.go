package models

// User 用户结构体（用于注册）
// example:"username: alice123"
type User struct {
	Username string `json:"username" example:"alice123"`
	Password string `json:"password" example:"securePass123"`
	Role     string `json:"role" example:"user"`
}

// LoginCredentials 登录用结构体
type LoginCredentials struct {
	Username string `json:"username" example:"alice123"`
	Password string `json:"password" example:"securePass123"`
}
