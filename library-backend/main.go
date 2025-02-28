package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"library-backend/config"
	"library-backend/middleware"
	"library-backend/routes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	_ "library-backend/docs" // ✅ 确保 Swagger 文档正确导入

	httpSwagger "github.com/swaggo/http-swagger" // ✅ 引入 Swagger 组件
)

// @title			Library Management API 文档
// @version		1.0
// @description	This is the back-end API for an online library management system
// @host			localhost:3000
// @BasePath		/
func main() {
	// 读取 .env 文件
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: No .env file found, using system environment variables")
	}

	// 获取端口号
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	// 初始化数据库连接
	if err := config.InitDB(); err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}

	// 设置路由
	r := mux.NewRouter()

	// ✅ 添加 Swagger 处理路由，确保 `doc.json` 可用
	r.PathPrefix("/swagger/").Handler(httpSwagger.Handler(
		httpSwagger.URL("http://localhost:" + port + "/swagger/doc.json"),
	))

	// 添加 API 相关路由
	routes.AuthRoutes(r)
	routes.BookRoutes(r)
	routes.BorrowRoutes(r)

	// 添加受 JWT 保护的路由
	r.Handle("/protected", middleware.VerifyToken(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "You accessed a protected route!")
	}))).Methods("GET")

	// 处理 CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(r)

	// 启动服务器
	log.Printf("Server running on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, corsHandler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
