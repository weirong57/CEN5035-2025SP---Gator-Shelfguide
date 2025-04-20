package models

import "time"

// User 用户结构体（用于注册）
type User struct {
	Username  string    `json:"username" example:"alice123"`
	Password  string    `json:"password" example:"securePass123"`
	Role      string    `json:"role" example:"user"`
	ID        int       `json:"id" example:"1"`  // 用户ID
	CreatedAt time.Time `json:"created_at"`      // 用户创建时间
}

// LoginCredentials 登录用结构体
type LoginCredentials struct {
	Username string `json:"username" example:"alice123"`
	Password string `json:"password" example:"securePass123"`
}
