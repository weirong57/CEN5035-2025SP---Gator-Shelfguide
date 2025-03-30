package models

// ReviewRequest 书评请求结构体
type ReviewRequest struct {
	UserID  int    `json:"userId"  example:"1"`           // 用户 ID
	BookID  int    `json:"bookId"  example:"101"`         // 图书 ID
	Rating  int    `json:"rating"  example:"5"`           // 评分（1-5）
	Comment string `json:"comment" example:"Great book!"` // 评论内容
}
