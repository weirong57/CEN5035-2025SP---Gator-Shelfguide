package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// BorrowRoutes 处理借书和还书的路由 / Handle book borrowing and returning routes
func BorrowRoutes(router *mux.Router) {
	//	@Summary		借书 / Borrow a Book
	//	@Description	用户借阅书籍 / Users borrow a book
	//	@Tags			借阅管理 / Borrow Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			borrowRequest	body		controllers.BorrowRequest	true	"借书请求 / Borrow Request"
	//	@Success		201				{object}	map[string]string			"成功响应 / Success Response"
	//	@Router			/borrow [post]
	router.HandleFunc("/borrow", controllers.BorrowBook).Methods(http.MethodPost)

	//	@Summary		还书 / Return a Book
	//	@Description	用户归还书籍 / Users return a book
	//	@Tags			借阅管理 / Borrow Management
	//	@Accept			json
	//	@Produce		json
	//	@Param			returnRequest	body		controllers.ReturnRequest	true	"还书请求 / Return Request"
	//	@Success		200				{object}	map[string]string			"成功响应 / Success Response"
	//	@Router			/borrow/return [post]
	router.HandleFunc("/borrow/return", controllers.ReturnBook).Methods(http.MethodPost)
}
