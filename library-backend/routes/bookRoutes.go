package routes

import (
	"library-backend/controllers"
	"net/http"

	"github.com/gorilla/mux"
)

// BookRoutes 设置图书相关的路由 / Set book-related routes
func BookRoutes(router *mux.Router) {

	router.HandleFunc("/books", controllers.GetAllBooks).Methods(http.MethodGet)
	router.HandleFunc("/books/{id:[0-9]+}", controllers.GetBookById).Methods(http.MethodGet)
	router.HandleFunc("/books", controllers.AddBook).Methods(http.MethodPost)
	router.HandleFunc("/books/{id:[0-9]+}", controllers.UpdateBook).Methods(http.MethodPut)
	router.HandleFunc("/books/{id:[0-9]+}", controllers.DeleteBook).Methods(http.MethodDelete)
}
