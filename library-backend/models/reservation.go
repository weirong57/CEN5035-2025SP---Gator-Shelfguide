package models

// ReservationRequest 用户预约请求结构体
type ReservationRequest struct {
	UserID int `json:"userId" example:"1"`
	BookID int `json:"bookId" example:"101"`
}
