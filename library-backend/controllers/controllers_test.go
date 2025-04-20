// controllers/controllers_test.go
package controllers_test

import (
	"log"
	"os"
	"testing"

	
	"library-backend/config" 
)

func TestMain(m *testing.M) {
	if err := config.InitTestDB(); err != nil {
		log.Fatalf("❌ 测试数据库初始化失败: %v", err)
	}
	

	// 将全局 DB 指针指向测试库
	config.DB = config.TestDB

	code := m.Run()

	if config.DB != nil {
		_ = config.DB.Close()
	}

	os.Exit(code)
}
