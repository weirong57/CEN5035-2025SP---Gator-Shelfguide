package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// BookRoutes 设置图书相关的路由 / Set book-related routes
func BookRoutes(router *mux.Router) {
	//	@Summary		获取所有图书 / Get All Books
	//	@Description	获取图书馆中的所有书籍，支持搜索 / Retrieve all books in the library, supports search
	//	@Tags			图书管理 / Book Management
	//	@Accept			json
	//	@Produce		json
	//	@Success		200	{object}	[]controllers.Book	"成功响应 / Success Response"
	//	@Router			/books [get]
	router.HandleFunc("/books", controllers.GetAllBooks).Methods(http.MethodGet)

	//	@Summary		获取单本书籍 / Get a Book
	//	@Description	通过 ID 获取一本书的信息 / Retrieve details of a book by ID
	//	@Tags			图书管理 / Book Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			id	path		int					true	"书籍 ID / Book ID"
	//	@Success		200	{object}	controllers.Book	"成功响应 / Success Response"
	//	@Router			/books/{id} [get]
	router.HandleFunc("/books/{id:[0-9]+}", controllers.GetBookById).Methods(http.MethodGet)

	//	@Summary		添加书籍 / Add a Book
	//	@Description	添加一本新书到图书馆 / Add a new book to the library
	//	@Tags			图书管理 / Book Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			book	body		controllers.Book	true	"书籍信息 / Book Information"
	//	@Success		201		{object}	map[string]string	"成功响应 / Success Response"
	//	@Router			/books [post]
	router.HandleFunc("/books", controllers.AddBook).Methods(http.MethodPost)

	//	@Summary		更新书籍 / Update a Book
	//	@Description	通过 ID 更新书籍信息 / Update book information by ID
	//	@Tags			图书管理 / Book Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			id		path		int					true	"书籍 ID / Book ID"
	//	@Param			book	body		controllers.Book	true	"更新后的书籍信息 / Updated Book Information"
	//	@Success		200		{object}	map[string]string	"成功响应 / Success Response"
	//	@Router			/books/{id} [put]
	router.HandleFunc("/books/{id:[0-9]+}", controllers.UpdateBook).Methods(http.MethodPut)

	//	@Summary		删除书籍 / Delete a Book
	//	@Description	通过 ID 删除书籍 / Delete a book by ID
	//	@Tags			图书管理 / Book Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			id	path		int					true	"书籍 ID / Book ID"
	//	@Success		200	{object}	map[string]string	"成功响应 / Success Response"
	//	@Router			/books/{id} [delete]
	router.HandleFunc("/books/{id:[0-9]+}", controllers.DeleteBook).Methods(http.MethodDelete)
}
