package controllers

import (
	"database/sql"
	"log"
	"os"
	"testing"

	"library-backend/config"

	_ "github.com/mattn/go-sqlite3" // 使用 SQLite 作为测试数据库 Use SQLite for test DB
)

// 初始化测试数据库
// Initialize the in-memory SQLite test database
func TestMain(m *testing.M) {
	var err error

	// 使用内存型 SQLite 数据库，测试完成后自动清空
	// Use SQLite in-memory DB which clears automatically after tests
	config.DB, err = sql.Open("sqlite3", ":memory:")
	if err != nil {
		log.Fatalf("测试数据库连接失败: %v", err)
		// Failed to connect to test database
	}

	// 创建所有测试所需的表结构
	// Create all required tables for testing
	createTables()

	insertTestData()

	// 执行所有测试用例
	// Run all tests
	code := m.Run()

	// 测试完成后关闭数据库连接
	// Close DB connection after test
	config.DB.Close()

	// 返回测试状态码
	// Exit with test status code
	os.Exit(code)
}

// 创建测试表结构
// Create table structure for testing
func createTables() {
	queries := []string{
		// 用户表
		// Users table
		`CREATE TABLE Users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT UNIQUE,
			password TEXT,
			role TEXT
		);`,

		// 图书表
		// Books table
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

		// 借阅记录表
		// Borrowing records table
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

		// 预约表
		// Reservations table
		`CREATE TABLE Reservations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			book_id INTEGER,
			status TEXT,
			created_at DATETIME,
			reserved_at DATETIME,
			FOREIGN KEY (user_id) REFERENCES Users(id),
			FOREIGN KEY (book_id) REFERENCES Books(id)
		);`,

		// 评论表
		// Reviews table
		`CREATE TABLE Reviews (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER,
			book_id INTEGER,
			rating INTEGER,
			comment TEXT,
			created_at DATETIME,
			FOREIGN KEY (user_id) REFERENCES Users(id),
			FOREIGN KEY (book_id) REFERENCES Books(id)
		);`,
	}

	// 依次执行所有建表语句
	// Execute all table creation queries
	for _, query := range queries {
		if _, err := config.DB.Exec(query); err != nil {
			log.Fatalf("建表失败: %v", err)
			// Table creation failed
		}
	}
}

// Insert initial data for testing
func insertTestData() {
	_, err := config.DB.Exec(`
		INSERT INTO Users (username, password, role)
		VALUES ('testuser', 'testpass', 'user');

		INSERT INTO Books (title, author, genre, language, shelf_number, available_copies, isbn)
		VALUES ('Test Book', 'Test Author', 'Fiction', 'English', 'A1', 5, 'ISBN123456');

		INSERT INTO BorrowingRecords (user_id, book_id, borrowed_at, due_date)
		VALUES (1, 1, datetime('now'), datetime('now', '+7 days'));
	`)
	if err != nil {
		log.Fatalf("插入测试数据失败: %v", err)
	}
}
