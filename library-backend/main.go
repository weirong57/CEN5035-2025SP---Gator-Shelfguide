package main

import (
	
	"log"
	"net/http"
	"os"
	"strings"

	"library-backend/config"
	"library-backend/controllers"

	_ "library-backend/docs"
	"library-backend/middleware"
	"library-backend/routes"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"

	// ✅ 确保 Swagger 文档正确导入
	httpSwagger "github.com/swaggo/http-swagger" // ✅ 引入 Swagger 组件
)

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
	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// 添加 API 相关路由
	apiRouter := r.PathPrefix("/api").Subrouter() // <-- ✅ 使用子路由自动添加 /api 前缀
	routes.AuthRoutes(apiRouter)
	routes.BookRoutes(apiRouter)
	routes.UserRoutes(apiRouter)
	routes.BorrowRoutes(apiRouter)
	routes.ReviewRoutes(apiRouter)
	routes.ReservationRoutes(apiRouter)

	// 添加受 JWT 保护的路由
	r.Handle("/borrow", middleware.VerifyToken(http.HandlerFunc(controllers.BorrowBook))).Methods("POST")
	r.Handle("/borrow/return", middleware.VerifyToken(http.HandlerFunc(controllers.ReturnBook))).Methods("POST")

	staticDir := "../library-system/dist"
	fs := http.FileServer(http.Dir(staticDir))                                                // ✅ ADDED
	r.PathPrefix("/").Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { // ✅ ADDED
		requestPath := r.URL.Path

		if strings.HasPrefix(requestPath, "/api/") {
			http.NotFound(w, r)
			return
		}

		fullPath := staticDir + requestPath
		if _, err := os.Stat(fullPath); err == nil {
			fs.ServeHTTP(w, r)
			return
		}

		http.ServeFile(w, r, staticDir+"/index.html")
	})) // ✅ ADDED

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
