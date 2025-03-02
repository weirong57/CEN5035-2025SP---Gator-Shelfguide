package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"library-backend/config"

	"golang.org/x/crypto/bcrypt"
)

// **测试用户注册** test uesr
func TestRegisterUser(t *testing.T) {
	user := User{
		Username: "testuser",
		Password: "password123",
		Role:     "user",
	}

	userJSON, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(RegisterUser)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("❌ 期望状态码 %v，实际状态码 %v", http.StatusCreated, rr.Code)
	}
}

// **测试用户登录**
func TestLoginUser(t *testing.T) {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.MinCost)
	config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)", "testuser", string(hashedPassword), "user")

	credentials := LoginCredentials{
		Username: "testuser",
		Password: "password123",
	}

	credentialsJSON, _ := json.Marshal(credentials)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(credentialsJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(LoginUser)

	os.Setenv("JWT_SECRET", "testsecret")
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("❌ 期望状态码 %v，实际状态码 %v", http.StatusOK, rr.Code)
	}

	// **解析返回的 JWT**
	var response map[string]string
	json.Unmarshal(rr.Body.Bytes(), &response)
	if response["token"] == "" {
		t.Errorf("❌ JWT 令牌未返回")
	}
}
