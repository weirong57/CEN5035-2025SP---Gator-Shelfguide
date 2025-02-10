package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"library-backend/config"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// UserClaims defines the structure of JWT payload
// 用户声明结构体，包含 JWT 负载
type UserClaims struct {
	UserID int    `json:"userId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// RegisterUser handles user registration
// 用户注册：
// 1. 检查用户名是否已存在
// 2. 如果不存在，哈希加密密码并插入数据库
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	// Parse request body / 解析请求体
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data / 请求数据无效", http.StatusBadRequest)
		return
	}

	// Check if the username already exists / 检查用户名是否已存在
	var exists bool
	err := config.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM Users WHERE username = ?)", requestData.Username).Scan(&exists)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error / 数据库错误", http.StatusInternalServerError)
		return
	}

	if exists {
		http.Error(w, "Username already taken / 用户名已被占用", http.StatusBadRequest)
		return
	}

	// Hash the password / 哈希加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestData.Password), bcrypt.MinCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		http.Error(w, "Server error / 服务器错误", http.StatusInternalServerError)
		return
	}

	// Insert new user into database / 插入新用户到数据库
	_, err = config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
		requestData.Username, string(hashedPassword), requestData.Role)
	if err != nil {
		log.Println("Error inserting user:", err)
		http.Error(w, "Database error / 数据库错误", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully / 用户注册成功"})
}

// LoginUser handles user authentication
// 用户登录：
// 1. 通过用户名查询用户
// 2. bcrypt 验证密码
// 3. 如果成功，生成 JWT 令牌并返回
func LoginUser(w http.ResponseWriter, r *http.Request) {
	var requestData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Parse request body / 解析请求体
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data / 请求数据无效", http.StatusBadRequest)
		return
	}

	// Retrieve user from database / 从数据库查询用户
	var user struct {
		ID       int
		Username string
		Password string
		Role     string
	}
	err := config.DB.QueryRow("SELECT id, username, password, role FROM Users WHERE username = ?", requestData.Username).
		Scan(&user.ID, &user.Username, &user.Password, &user.Role)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid username or password / 无效的用户名或密码", http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Server error / 服务器错误", http.StatusInternalServerError)
		return
	}

	// Compare password / 比较密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestData.Password)); err != nil {
		http.Error(w, "Invalid username or password / 无效的用户名或密码", http.StatusUnauthorized)
		return
	}

	// 获取 JWT_SECRET
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("Warning: JWT_SECRET is not set in the environment variables")
		http.Error(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	// Generate JWT token / 生成 JWT 令牌
	claims := UserClaims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expires in 1 day / 令牌有效期 1 天
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Println("Error generating token:", err)
		http.Error(w, "Server error / 服务器错误", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful / 登录成功", "token": tokenString})
}
