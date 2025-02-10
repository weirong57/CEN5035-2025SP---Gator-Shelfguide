package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

// 全局数据库变量
var DB *sql.DB

// InitDB 负责初始化数据库连接，并返回 error
func InitDB() error {
	// 读取 .env 文件
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}

	// 获取数据库配置
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	// 输出环境变量以便调试
	log.Println("Database Configuration:")
	log.Printf("DB_HOST: %s, DB_USER: %s, DB_PASSWORD: %s, DB_NAME: %s", dbHost, dbUser, dbPassword, dbName)

	// 组装 MySQL 连接字符串
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbName)

	// 连接数据库
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("error connecting to database: %w", err)
	}

	// 设置数据库连接池参数
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)

	// 测试数据库连接
	err = db.Ping()
	if err != nil {
		return fmt.Errorf("error verifying database connection: %w", err)
	}

	log.Println("Connected to the database successfully")
	DB = db
	return nil
}
