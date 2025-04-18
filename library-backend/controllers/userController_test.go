package controllers

import (
	
	"encoding/json"
	"library-backend/config"
	"library-backend/models"
	"net/http"
	"net/http/httptest"
	"testing"

	
	"github.com/stretchr/testify/assert"
)

// TestGetUserProfile 测试 GetUserProfile 函数
func TestGetUserProfile(t *testing.T) {
	// Setup
	req, err := http.NewRequest("GET", "/users/1", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 使用 httptest.NewRecorder() 来模拟一个响应
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUserProfile)

	// 执行请求
	handler.ServeHTTP(rr, req)

	// 检查响应状态码
	assert.Equal(t, http.StatusOK, rr.Code, "Expected status code 200")

	// 检查返回的 JSON 数据
	var user models.User
	err = json.NewDecoder(rr.Body).Decode(&user)
	if err != nil {
		t.Fatal(err)
	}

	// 检查返回的用户数据是否正确
	assert.Equal(t, "alice123", user.Username, "Expected username to be alice123")
	assert.NotEmpty(t, user.CreatedAt, "Expected CreatedAt to be populated")
}

// TestGetUserBorrowingRecords 测试 GetUserBorrowingRecords 函数
func TestGetUserBorrowingRecords(t *testing.T) {
	// Setup
	req, err := http.NewRequest("GET", "/users/1/records", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 使用 httptest.NewRecorder() 来模拟一个响应
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUserBorrowingRecords)

	// 执行请求
	handler.ServeHTTP(rr, req)

	// 检查响应状态码
	assert.Equal(t, http.StatusOK, rr.Code, "Expected status code 200")

	// 检查返回的 JSON 数据
	var records []models.BorrowingRecord
	err = json.NewDecoder(rr.Body).Decode(&records)
	if err != nil {
		t.Fatal(err)
	}

	// 检查返回的借阅记录是否为非空
	assert.Greater(t, len(records), 0, "Expected borrowing records to be present")
}

// TestGetUserProfileNotFound 测试用户未找到时的情况
func TestGetUserProfileNotFound(t *testing.T) {
	// Setup
	req, err := http.NewRequest("GET", "/users/999", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 使用 httptest.NewRecorder() 来模拟一个响应
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUserProfile)

	// 执行请求
	handler.ServeHTTP(rr, req)

	// 检查响应状态码
	assert.Equal(t, http.StatusNotFound, rr.Code, "Expected status code 404")

	// 检查返回的 JSON 数据
	var response map[string]string
	err = json.NewDecoder(rr.Body).Decode(&response)
	if err != nil {
		t.Fatal(err)
	}

	// 检查返回的错误消息
	assert.Equal(t, "User not found", response["message"], "Expected error message to be 'User not found'")
}

// TestGetUserBorrowingRecordsEmpty 测试用户没有借阅记录时的情况
func TestGetUserBorrowingRecordsEmpty(t *testing.T) {
	// Setup
	req, err := http.NewRequest("GET", "/users/999/records", nil)
	if err != nil {
		t.Fatal(err)
	}

	// 使用 httptest.NewRecorder() 来模拟一个响应
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetUserBorrowingRecords)

	// 执行请求
	handler.ServeHTTP(rr, req)

	// 检查响应状态码
	assert.Equal(t, http.StatusOK, rr.Code, "Expected status code 200")

	// 检查返回的 JSON 数据
	var records []models.BorrowingRecord
	err = json.NewDecoder(rr.Body).Decode(&records)
	if err != nil {
		t.Fatal(err)
	}

	// 检查返回的借阅记录是否为空
	assert.Equal(t, 0, len(records), "Expected no borrowing records for the user")
}

// TestSetupDB 初始化测试数据库，确保测试前环境准备正确
func TestSetupDB(t *testing.T) {
	err := config.InitDB()
	if err != nil {
		t.Fatalf("Database setup failed: %v", err)
	}
}
