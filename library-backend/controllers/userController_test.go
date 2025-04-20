package controllers_test

import (
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"library-backend/config"
	"library-backend/controllers"

	"github.com/gorilla/mux" // ✅ 引入 mux
)

func insertTestUser(t *testing.T) int {
	res, err := config.DB.Exec("INSERT INTO Users (username, password, role) VALUES (?, ?, ?)", "profile_user", "pass", "user")
	if err != nil {
		t.Fatalf("插入用户失败: %v", err)
	}
	id, _ := res.LastInsertId()
	return int(id)
}

func deleteTestUser(t *testing.T, id int) {
	config.DB.Exec("DELETE FROM Users WHERE id = ?", id)
}

func TestGetUserProfile_Success(t *testing.T) {
	userID := insertTestUser(t)
	defer deleteTestUser(t, userID)

	// 创建请求并注入路径参数
	req := httptest.NewRequest("GET", "/users/"+strconv.Itoa(userID), nil)
	req = mux.SetURLVars(req, map[string]string{"id": strconv.Itoa(userID)})

	rec := httptest.NewRecorder()
	controllers.GetUserProfile(rec, req)

	if rec.Code != http.StatusOK {
		t.Errorf("期望状态码 200，但实际为 %d", rec.Code)
	}
}
