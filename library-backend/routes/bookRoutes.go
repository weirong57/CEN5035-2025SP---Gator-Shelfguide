package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// 设置图书相关的路由
// Set book-related routes
func BookRoutes(router *mux.Router) {
	// 获取所有图书（支持搜索）
	// Get all books (supports search)
	router.HandleFunc("/books", controllers.GetAllBooks).Methods(http.MethodGet)

	// 获取单本图书（通过 ID）
	// Get a single book by ID
	router.HandleFunc("/books/{id:[0-9]+}", controllers.GetBookById).Methods(http.MethodGet)

	// 添加新书
	// Add a new book
	router.HandleFunc("/books", controllers.AddBook).Methods(http.MethodPost)

	// 更新图书信息
	// Update a book
	router.HandleFunc("/books/{id:[0-9]+}", controllers.UpdateBook).Methods(http.MethodPut)

	// 删除图书
	// Delete a book
	router.HandleFunc("/books/{id:[0-9]+}", controllers.DeleteBook).Methods(http.MethodDelete)
}
