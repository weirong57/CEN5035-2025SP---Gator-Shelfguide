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

// @Summary      Get All Books
// @Description  Retrieve all books in the library, supports search
// @Tags         Book Management
// @Accept       json
// @Produce      json
// @Param        search query string false "Search keyword"
// @Success      200 {object} []Book "Success Response"
// @Failure      500 {string} string "Server error"
// @Router       /books [get]
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

// @Summary      Get a Book by ID
// @Description  Retrieve details of a book by ID
// @Tags         Book Management
// @Accept       json
// @Produce      json
// @Param        id path int true "Book ID"
// @Success      200 {object} Book "Success Response"
// @Failure      400 {string} string "Invalid book ID"
// @Failure      404 {string} string "Book not found"
// @Failure      500 {string} string "Server error"
// @Router       /books/{id} [get]

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

// @Summary      Add a New Book
// @Description  Add a new book to the library
// @Tags         Book Management
// @Accept       json
// @Produce      json
// @Param        book body Book true "Book Information"
// @Success      201 {object} map[string]interface{} "Success Response"
// @Failure      400 {string} string "Invalid request body"
// @Failure      500 {string} string "Database error"
// @Router       /books [post]

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

	w.WriteHeader(http.StatusCreated)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// @Summary      Delete a Book
// @Description  Delete a book by ID
// @Tags         Book Management
// @Accept       json
// @Produce      json
// @Param        id path int true "Book ID"
// @Success      200 {object} map[string]string "Success Response"
// @Failure      400 {string} string "Invalid book ID"
// @Failure      404 {string} string "Book not found"
// @Router       /books/{id} [delete]

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

// @Summary      Update a Book
// @Description  Update book information by ID
// @Tags         Book Management
// @Accept       json
// @Produce      json
// @Param        id   path  int   true "Book ID"
// @Param        book body  Book  true "Updated Book Information"
// @Success      200  {object} map[string]string "Success Response"
// @Failure      400  {string} string "Invalid book ID"
// @Failure      404  {string} string "Book not found"
// @Failure      500  {string} string "Database error"
// @Router       /books/{id} [put]

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
