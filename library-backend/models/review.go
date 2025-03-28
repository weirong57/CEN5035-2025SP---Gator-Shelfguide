// models/review.go
package models

import (
	"time"
)

type Review struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	BookID    uint      `json:"book_id"`
	UserID    uint      `json:"user_id"`
	Rating    int       `json:"rating" binding:"required,min=1,max=5"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}
