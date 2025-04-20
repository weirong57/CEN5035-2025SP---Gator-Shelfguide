package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"library-backend/config"
	"library-backend/models"

	"github.com/gorilla/mux"
)

// AddBook 添加新图书（管理员专用）
// @Summary 添加图书 (Admin only)
// @Description 管理员添加图书到数据库中 (Add a new book with full information)
// @Tags 管理员功能 (Admin)
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param book body models.Book true "图书信息 (Book Information)"
// @Success 201 {object} map[string]interface{} "添加成功"
// @Failure 400 {object} map[string]string "请求数据错误"
// @Failure 500 {object} map[string]string "数据库错误"
// @Router /admin/books [post]
func AddBook(w http.ResponseWriter, r *http.Request) {
	var book models.Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		http.Error(w, "Invalid request body / 无效的请求数据", http.StatusBadRequest)
		return
	}

	result, err := config.DB.Exec("INSERT INTO Books (title, author, genre, language, shelf_number, available_copies, isbn) VALUES (?, ?, ?, ?, ?, ?, ?)",
		book.Title, book.Author, book.Genre, book.Language, book.ShelfNumber, book.AvailableCopies, book.ISBN,
	)

	if err != nil {
		log.Println("addBook Error:", err)
		http.Error(w, "Database error / 数据库错误", http.StatusInternalServerError)
		return
	}

	insertID, _ := result.LastInsertId()
	response := map[string]interface{}{
		"message": "Book added successfully / 图书添加成功",
		"bookId":  insertID,
	}

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// DeleteBook 删除图书（管理员专用）
// @Summary 删除图书 (Admin only)
// @Description 管理员根据图书 ID 删除图书 (Delete a book by ID)
// @Tags 管理员功能 (Admin)
// @Security BearerAuth
// @Accept json
// @Produce json
// @Param id path int true "图书 ID"
// @Success 200 {object} map[string]string "删除成功"
// @Failure 400 {object} map[string]string "无效 ID"
// @Failure 404 {object} map[string]string "图书未找到"
// @Failure 500 {object} map[string]string "数据库错误"
// @Router /admin/books/{id} [delete]
func DeleteBook(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bookId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid book ID / 无效的图书 ID", http.StatusBadRequest)
		return
	}

	result, err := config.DB.Exec("DELETE FROM Books WHERE id = ?", bookId)
	if err != nil {
		log.Println("deleteBook Error:", err)
		http.Error(w, "Database error / 数据库错误", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Book not found / 图书未找到", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Book deleted successfully / 图书删除成功"})
}
