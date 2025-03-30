package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"library-backend/config"

	"library-backend/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// 添加 UserClaims 结构体（用于 JWT 令牌）
type UserClaims struct {
	UserID int    `json:"userId"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// RegisterUser handles user registration
// @Summary Register a new user
// @Description Allows a new user to register with username, password, and role
// @Tags Authentication
// @Accept json
// @Produce json
// @Param user body models.User true "User information"
// @Success 201 {object} map[string]string "Registration successful"
// @Failure 400 {object} map[string]string "Invalid request"
// @Failure 500 {object} map[string]string "Server error"
// @Router /register [post]
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var requestData models.User

	// 解析 JSON
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// 检查用户名是否已存在
	var exists bool
	err := config.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM Users WHERE username = ?)", requestData.Username).Scan(&exists)
	if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Username already taken", http.StatusBadRequest)
		return
	}

	// 哈希加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(requestData.Password), bcrypt.MinCost)
	if err != nil {
		log.Println("Error hashing password:", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// 插入新用户
	_, err = config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
		requestData.Username, string(hashedPassword), requestData.Role)
	if err != nil {
		log.Println("Error inserting user:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "User registered successfully"})
}

// LoginUser handles user login
// @Summary User login and get JWT
// @Description User logs in and receives a JWT token
// @Tags Authentication
// @Accept json
// @Produce json
// @Param credentials body models.LoginCredentials true "Login credentials"
// @Success 200 {object} map[string]string "Login successful"
// @Failure 400 {object} map[string]string "Invalid request"
// @Failure 401 {object} map[string]string "Invalid username or password"
// @Failure 500 {object} map[string]string "Server error"
// @Router /login [post]
func LoginUser(w http.ResponseWriter, r *http.Request) {
	var requestData models.LoginCredentials

	// 解析 JSON
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}

	// 查询用户
	var user struct {
		ID       int
		Username string
		Password string
		Role     string
	}
	err := config.DB.QueryRow("SELECT id, username, password, role FROM Users WHERE username = ?", requestData.Username).
		Scan(&user.ID, &user.Username, &user.Password, &user.Role)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	} else if err != nil {
		log.Println("Database error:", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(requestData.Password)); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// 获取 JWT_SECRET
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		log.Println("Warning: JWT_SECRET is not set in the environment variables")
		http.Error(w, "Server configuration error", http.StatusInternalServerError)
		return
	}

	// 生成 JWT 令牌
	claims := UserClaims{
		UserID: user.ID,
		Role:   user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // Token expires in 1 day
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		log.Println("Error generating token:", err)
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "token": tokenString})
}
