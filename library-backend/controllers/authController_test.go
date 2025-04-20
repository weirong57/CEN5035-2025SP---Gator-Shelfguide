package controllers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"
	"golang.org/x/crypto/bcrypt"


	"library-backend/config"
	"library-backend/controllers"
	"library-backend/models"
)

func cleanupTestAuthUser(username string) {
	config.DB.Exec("DELETE FROM Users WHERE username = ?", username)
}

func TestRegisterUser_Success(t *testing.T) {
	testUsername := "test_register_user"

	cleanupTestAuthUser(testUsername) // 清理旧数据

	user := models.User{
		Username: testUsername,
		Password: "testpass123",
		Role:     "user",
	}
	data, _ := json.Marshal(user)

	req := httptest.NewRequest("POST", "/register", bytes.NewReader(data))
	rec := httptest.NewRecorder()

	controllers.RegisterUser(rec, req)

	if rec.Code != http.StatusCreated {
		t.Errorf("注册失败，状态码应为 201，实际为 %d", rec.Code)
	}

	cleanupTestAuthUser(testUsername) // 注册后清理
}

func TestLoginUser_Success(t *testing.T) {
	testUsername := "test_login_user"
	testPassword := "testpass123"

	// 清理旧数据
	cleanupTestAuthUser(testUsername)

	// ✅ 生成 bcrypt 哈希密码（动态）
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(testPassword), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("密码加密失败: %v", err)
	}

	// ✅ 插入测试用户（使用加密密码）
	_, err = config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)",
		testUsername, string(hashedPassword), "user")
	if err != nil {
		t.Fatalf("插入测试用户失败: %v", err)
	}

	// 设置 token secret
	os.Setenv("JWT_SECRET", "testsecret")

	// 构造登录请求
	login := models.LoginCredentials{
		Username: testUsername,
		Password: testPassword,
	}
	data, _ := json.Marshal(login)

	req := httptest.NewRequest("POST", "/login", bytes.NewReader(data))
	rec := httptest.NewRecorder()

	controllers.LoginUser(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("登录失败，状态码应为 200，实际为 %d", rec.Code)
	}
}
