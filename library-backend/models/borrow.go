package models

import (
	"database/sql"
	"time"
)

// BorrowRequest 借阅请求结构体
type BorrowRequest struct {
	UserID int `json:"userId" example:"1"`   // 用户 ID
	BookID int `json:"bookId" example:"101"` // 图书 ID
}

// BorrowingRecord 借阅记录
type BorrowingRecord struct {
	ID         int            `json:"id"`
	UserID     int            `json:"user_id"`
	BookID     int            `json:"book_id"`
	Title      string         `json:"title"`    // 图书标题
	Author     string         `json:"author"`   // 图书作者
	ISBN       string         `json:"isbn"`     // 图书ISBN
	BorrowedAt time.Time      `json:"borrowed_at"`
	DueDate    time.Time      `json:"due_date"`
	ReturnedAt sql.NullTime   `json:"returned_at,omitempty"` // 修改为 sql.NullTime
	Status     string         `json:"status"` // Borrowing, Returned, Overdue
}
