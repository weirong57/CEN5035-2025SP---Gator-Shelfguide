package models

// Book 图书结构体
type Book struct {
	ID              int    `json:"id" example:"101"`              // 图书 ID
	Title           string `json:"title" example:"Golang Basics"` // 标题
	Author          string `json:"author" example:"John Doe"`     // 作者
	Genre           string `json:"genre" example:"Programming"`   // 类型
	Language        string `json:"language" example:"English"`    // 语言
	ShelfNumber     string `json:"shelf_number" example:"A-12"`   // 书架号
	AvailableCopies int    `json:"available_copies" example:"3"`  // 可借数量
	ISBN            string `json:"isbn" example:"9781234567890"`  // ISBN
}
