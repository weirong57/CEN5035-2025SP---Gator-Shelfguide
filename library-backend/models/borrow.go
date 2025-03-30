package models

// BorrowRequest 借阅请求结构体
type BorrowRequest struct {
	UserID int `json:"userId" example:"1"`   // 用户 ID
	BookID int `json:"bookId" example:"101"` // 图书 ID
}
