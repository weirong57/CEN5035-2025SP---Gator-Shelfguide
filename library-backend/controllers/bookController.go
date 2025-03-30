package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"library-backend/config"
	"library-backend/models"

	"github.com/gorilla/mux"
)

// GetAllBooks 获取所有图书 (Get All Books)
// @Summary 获取所有图书 (Retrieve all books)
// @Description 获取图书列表，支持按关键词搜索 (Retrieve all books in the library, optionally filter by keyword)
// @Tags 图书管理 (Book Management)
// @Accept json
// @Produce json
// @Param search query string false "搜索关键词 (Search keyword)"
// @Success 200 {object} []models.Book "成功响应 (Success Response)"
// @Failure 500 {object} map[string]string "服务器错误 (Server error)"
// @Router /books [get]
func GetAllBooks(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	query := "SELECT * FROM Books"
	params := []interface{}{}

	if search != "" {
		query += " WHERE title LIKE ? OR author LIKE ? OR genre LIKE ?"
		like := "%" + search + "%"
		params = append(params, like, like, like)
	}

	rows, err := config.DB.Query(query, params...)
	if err != nil {
		log.Println("getAllBooks Error:", err)
		http.Error(w, "Server error / 服务器错误", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var books []models.Book
	for rows.Next() {
		var book models.Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Genre, &book.Language, &book.ShelfNumber, &book.AvailableCopies, &book.ISBN); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		books = append(books, book)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

// GetBookById 根据 ID 获取图书信息 (Get Book by ID)
// @Summary 获取单本图书信息 (Retrieve book details by ID)
// @Description 根据图书 ID 获取详细信息 (Retrieve detailed information of a specific book by ID)
// @Tags 图书管理 (Book Management)
// @Accept json
// @Produce json
// @Param id path int true "图书 ID (Book ID)"
// @Success 200 {object} models.Book "成功响应 (Success Response)"
// @Failure 400 {object} map[string]string "无效 ID (Invalid book ID)"
// @Failure 404 {object} map[string]string "图书未找到 (Book not found)"
// @Failure 500 {object} map[string]string "服务器错误 (Server error)"
// @Router /books/{id} [get]
func GetBookById(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bookId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid book ID / 无效的图书 ID", http.StatusBadRequest)
		return
	}

	var book models.Book
	err = config.DB.QueryRow("SELECT * FROM Books WHERE id = ?", bookId).Scan(
		&book.ID, &book.Title, &book.Author, &book.Genre, &book.Language, &book.ShelfNumber, &book.AvailableCopies, &book.ISBN,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Book not found / 图书未找到", http.StatusNotFound)
		return
	} else if err != nil {
		log.Println("getBookById Error:", err)
		http.Error(w, "Server error / 服务器错误", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(book)
}

// AddBook 添加新图书 (Add a New Book)
// @Summary 添加图书 (Add a new book to library)
// @Description 将新图书添加到数据库中 (Add a new book with full information)
// @Tags 图书管理 (Book Management)
// @Accept json
// @Produce json
// @Param book body models.Book true "图书信息 (Book Information)"
// @Success 201 {object} map[string]interface{} "添加成功响应 (Success Response)"
// @Failure 400 {object} map[string]string "请求数据错误 (Invalid request body)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /books [post]
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

// DeleteBook 删除图书 (Delete a Book)
// @Summary 删除指定图书 (Delete a book by ID)
// @Description 根据图书 ID 删除图书信息 (Delete a book record by its ID)
// @Tags 图书管理 (Book Management)
// @Accept json
// @Produce json
// @Param id path int true "图书 ID (Book ID)"
// @Success 200 {object} map[string]string "删除成功 (Success Response)"
// @Failure 400 {object} map[string]string "无效 ID (Invalid book ID)"
// @Failure 404 {object} map[string]string "图书未找到 (Book not found)"
// @Failure 500 {object} map[string]string "服务器错误 (Server error)"
// @Router /books/{id} [delete]
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

// UpdateBook 更新图书信息 (Update a Book)
// @Summary 更新图书 (Update book by ID)
// @Description 根据图书 ID 更新对应信息 (Update book details by ID)
// @Tags 图书管理 (Book Management)
// @Accept json
// @Produce json
// @Param id path int true "图书 ID (Book ID)"
// @Param book body models.Book true "更新后的图书信息 (Updated Book Information)"
// @Success 200 {object} map[string]string "更新成功 (Success Response)"
// @Failure 400 {object} map[string]string "无效 ID 或数据错误 (Invalid book ID or body)"
// @Failure 404 {object} map[string]string "图书未找到 (Book not found)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /books/{id} [put]
func UpdateBook(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bookId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid book ID / 无效的图书 ID", http.StatusBadRequest)
		return
	}

	var book models.Book
	if err := json.NewDecoder(r.Body).Decode(&book); err != nil {
		http.Error(w, "Invalid request body / 无效的请求数据", http.StatusBadRequest)
		return
	}

	result, err := config.DB.Exec("UPDATE Books SET title=?, author=?, genre=?, language=?, shelf_number=?, available_copies=?, isbn=? WHERE id=?",
		book.Title, book.Author, book.Genre, book.Language, book.ShelfNumber, book.AvailableCopies, book.ISBN, bookId,
	)

	if err != nil {
		log.Println("updateBook Error:", err)
		http.Error(w, "Database error / 数据库错误", http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		http.Error(w, "Book not found / 图书未找到", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Book updated successfully / 图书更新成功"})
}
