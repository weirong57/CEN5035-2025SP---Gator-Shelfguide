package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	_ "github.com/go-sql-driver/mysql"
)

var TestDB *sql.DB

func InitTestDB() error {
	envPath := filepath.Join(".", "..", ".env.test")

	err := godotenv.Load(envPath)
	if err != nil {
		log.Println("⚠️ .env.test file not found / 未找到 .env.test 文件，将使用系统环境变量")
	}

	log.Println("📄 Loading environment from / 尝试加载配置文件:", envPath)

	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")

	log.Println("🔍 DB_HOST =", host)
	log.Println("🔍 DB_PORT =", port)
	log.Println("🔍 DB_USER =", user)
	log.Println("🔍 DB_PASSWORD =", password)
	log.Println("🔍 DB_NAME =", dbname)

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", user, password, host, port, dbname)

	TestDB, err = sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("❌ Failed to open test DB / 打开测试数据库失败: %v", err)
	}

	if err := TestDB.Ping(); err != nil {
		return fmt.Errorf("❌ Failed to ping test DB / 无法连接测试数据库: %v", err)
	}

	log.Println("✅ Connected to test DB / 成功连接到测试数据库:", dbname)
	return nil
}
