package controllers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"library-backend/config"

	"github.com/gorilla/mux"
)

// Book 结构体
// Book struct for representing a book
type Book struct {
	ID              int    `json:"id"`
	Title           string `json:"title"`
	Author          string `json:"author"`
	Genre           string `json:"genre"`
	Language        string `json:"language"`
	ShelfNumber     string `json:"shelf_number"`
	AvailableCopies int    `json:"available_copies"`
	ISBN            string `json:"isbn"`
}

//	@Summary		获取所有图书 / Get All Books
//	@Description	获取图书馆中的所有书籍，支持搜索 / Retrieve all books in the library, supports search
//	@Tags			图书管理 / Book Management
//	@Accept			json
//	@Produce		json
//	@Param			search	query		string	false	"搜索关键词 / Search keyword"
//	@Success		200		{object}	[]Book	"成功响应 / Success Response"
//	@Failure		500		{string}	string	"服务器错误 / Server error"
//	@Router			/books [get]
// 获取所有图书（支持搜索功能）
// Get all books (supports search)
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

	var books []Book
	for rows.Next() {
		var book Book
		if err := rows.Scan(&book.ID, &book.Title, &book.Author, &book.Genre, &book.Language, &book.ShelfNumber, &book.AvailableCopies, &book.ISBN); err != nil {
			log.Println("Error scanning row:", err)
			continue
		}
		books = append(books, book)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(books)
}

//	@Summary		获取单本图书 / Get a Book by ID
//	@Description	通过 ID 获取一本书的信息 / Retrieve details of a book by ID
//	@Tags			图书管理 / Book Management
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int		true	"书籍 ID / Book ID"
//	@Success		200	{object}	Book	"成功响应 / Success Response"
//	@Failure		400	{string}	string	"无效的图书 ID / Invalid book ID"
//	@Failure		404	{string}	string	"图书未找到 / Book not found"
//	@Failure		500	{string}	string	"服务器错误 / Server error"
//	@Router			/books/{id} [get]
// 获取单本图书（通过 ID）
// Get a single book by ID
func GetBookById(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bookId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid book ID / 无效的图书 ID", http.StatusBadRequest)
		return
	}

	var book Book
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

//	@Summary		添加新书 / Add a New Book
//	@Description	添加一本新书到图书馆 / Add a new book to the library
//	@Tags			图书管理 / Book Management
//	@Accept			json
//	@Produce		json
//	@Param			book	body		Book					true	"书籍信息 / Book Information"
//	@Success		201		{object}	map[string]interface{}	"成功响应 / Success Response"
//	@Failure		400		{string}	string					"无效的请求数据 / Invalid request body"
//	@Failure		500		{string}	string					"数据库错误 / Database error"
//	@Router			/books [post]
// 添加新书
// Add a new book
func AddBook(w http.ResponseWriter, r *http.Request) {
	var book Book
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

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

//	@Summary		删除图书 / Delete a Book
//	@Description	通过 ID 删除书籍 / Delete a book by ID
//	@Tags			图书管理 / Book Management
//	@Accept			json
//	@Produce		json
//	@Param			id	path		int					true	"书籍 ID / Book ID"
//	@Success		200	{object}	map[string]string	"成功响应 / Success Response"
//	@Failure		400	{string}	string				"无效的图书 ID / Invalid book ID"
//	@Failure		404	{string}	string				"图书未找到 / Book not found"
//	@Failure		500	{string}	string				"数据库错误 / Database error"
//	@Router			/books/{id} [delete]
// 删除图书
// Delete a book
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

//	@Summary		更新图书 / Update a Book
//	@Description	通过 ID 更新书籍信息 / Update book information by ID
//	@Tags			图书管理 / Book Management
//	@Accept			json
//	@Produce		json
//	@Param			id		path		int					true	"书籍 ID / Book ID"
//	@Param			book	body		Book				true	"更新后的书籍信息 / Updated Book Information"
//	@Success		200		{object}	map[string]string	"成功响应 / Success Response"
//	@Failure		400		{string}	string				"无效的图书 ID / Invalid book ID"
//	@Failure		404		{string}	string				"图书未找到 / Book not found"
//	@Failure		500		{string}	string				"数据库错误 / Database error"
//	@Router			/books/{id} [put]
// 更新图书信息
// Update a book's information
func UpdateBook(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bookId, err := strconv.Atoi(params["id"])
	if err != nil {
		http.Error(w, "Invalid book ID / 无效的图书 ID", http.StatusBadRequest)
		return
	}

	var book Book
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
