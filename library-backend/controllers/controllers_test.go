package controllers

import (
	"database/sql"
	"log"
	"os"
	"testing"

	"library-backend/config"

	_ "github.com/mattn/go-sqlite3" // 使用 SQLite 作为测试数据库
)

// **初始化测试数据库**
func TestMain(m *testing.M) {
	var err error

	// **使用 SQLite 内存数据库**
	config.DB, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatalf("❌ 测试数据库连接失败: %v", err)
	}

	// **创建测试表**
	createTables()

	// **运行测试**
	code := m.Run()

	// **关闭数据库**
	config.DB.Close()

	// **退出测试**
	os.Exit(code)
}

// **创建表结构**
func createTables() {
	queries := []string{
		`CREATE TABLE Users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE,
			password TEXT,
			role TEXT
		);`,
		`CREATE TABLE Books (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT,
			author TEXT,
			genre TEXT,
			language TEXT,
			shelf_number TEXT,
			available_copies INTEGER,
			isbn TEXT UNIQUE
		);`,
		`CREATE TABLE BorrowingRecords (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			book_id INTEGER,
			borrowed_at DATETIME,
			due_date DATETIME,
			returned_at DATETIME NULL,
			FOREIGN KEY (user_id) REFERENCES Users(id),
			FOREIGN KEY (book_id) REFERENCES Books(id)
		);`,
	}

	for _, query := range queries {
		if _, err := config.DB.Exec(query); err != nil {
			log.Fatalf("❌ 失败创建表: %v", err)
		}
	}
}
