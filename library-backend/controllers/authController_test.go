package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"library-backend/config"
	"library-backend/models"

	"golang.org/x/crypto/bcrypt"
)

// **测试用户注册** test uesr
func TestRegisterUser(t *testing.T) {
	user := models.User{
		Username: "newtestuser",
		Password: "newtestpass",
		Role:     "user",
	}

	userJSON, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/register", bytes.NewBuffer(userJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(RegisterUser)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusCreated {
		t.Errorf("❌ Expected status code %v，Actual status code %v", http.StatusCreated, rr.Code)
	}
}

// **测试用户登录/Test user login**
func TestLoginUser(t *testing.T) {

	os.Setenv("JWT_SECRET", "testsecret")

	username := "test_login_unique_123" // ✅ 使用唯一用户名
	password := "password123"

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)

	_, err := config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)", username, string(hashedPassword), "user")
	if err != nil {
		t.Fatalf("❌ Failed to insert test user: %v", err)
	}

	credentials := models.LoginCredentials{
		Username: username,
		Password: password,
	}

	credentialsJSON, _ := json.Marshal(credentials)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(credentialsJSON))
	req.Header.Set("Content-Type", "application/json")

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(LoginUser)
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("❌ Expected status code %v，Actual status code %v", http.StatusOK, rr.Code)
	}

	// **解析返回的 JWT Parses the returned JWT**
	var response map[string]string
	json.Unmarshal(rr.Body.Bytes(), &response)
	if response["token"] == "" {
		t.Errorf("❌ The JWT token was not returned")
	}
}
