package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"library-backend/config"
	"library-backend/models"
	"github.com/gorilla/mux" 
)

// AddReview 添加书评 (Add a Review)
// @Summary 添加图书书评 (Create a new review)
// @Description 用户对已借阅的图书添加书评，支持评分和评论内容 (User adds a review to a book they have borrowed; includes rating and comment)
// @Tags 书评 (Review)
// @Accept json
// @Produce json
// @Param review body models.ReviewRequest true "书评请求参数 (Review Request)"
// @Success 200 {object} map[string]string "添加成功 (Review added successfully)"
// @Failure 400 {object} map[string]string "请求数据无效 (Invalid request data)"
// @Failure 403 {object} map[string]string "仅可评论借阅过的书籍 (Only borrowed books can be reviewed)"
// @Failure 409 {object} map[string]string "重复评论 (Already reviewed this book)"
// @Failure 500 {object} map[string]string "数据库或事务错误 (Database or transaction error)"
// @Router /reviews [post]
func AddReview(w http.ResponseWriter, r *http.Request) {
	// Decode the request body into the ReviewRequest struct / 将请求体解码到 ReviewRequest 结构体中
	var request models.ReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		log.Println("❌ 请求体解码失败:", err)
		http.Error(w, "Invalid request data", http.StatusBadRequest)
		return
	}
	//字段空值校验/Field null checking
	if request.UserID == 0 || request.BookID == 0 || request.Rating == 0 {
		log.Println("❌ 请求字段缺失")
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Validate rating to ensure it is between 1 and 5 / 验证评分是否在1到5之间
	if request.Rating < 1 || request.Rating > 5 {
		log.Println("❌ 无效评分:", request.Rating)
		http.Error(w, "Rating must be between 1 and 5", http.StatusBadRequest)
		return
	}

	// Start a new transaction / 开启一个新的数据库事务
	tx, err := config.DB.Begin()
	if err != nil {
		log.Println("❌ 启动事务失败:", err)
		http.Error(w, "Failed to start transaction", http.StatusInternalServerError)
		return
	}
	// Ensure the transaction rolls back if commit fails / 如果提交失败则确保回滚事务
	defer tx.Rollback()

	// Check if the user has borrowed the book / 检查用户是否借阅过该书籍
	var borrowCount int
	err = tx.QueryRow("SELECT COUNT(*) FROM BorrowingRecords WHERE user_id = ? AND book_id = ?",
		request.UserID, request.BookID).Scan(&borrowCount)
	if err != nil {
		log.Println("❌ 查询借阅记录失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	// If the user hasn't borrowed the book, they cannot review it / 如果用户没有借阅该书，则无法进行书评
	if borrowCount == 0 {
		log.Println("❌ 用户未借阅此书:", request.BookID)
		http.Error(w, "You can only review books you have borrowed", http.StatusForbidden)
		return
	}

	// Check for an existing review by the user for the same book / 检查该用户是否已经对此书进行过书评
	var existingReview int
	err = tx.QueryRow("SELECT COUNT(*) FROM Reviews WHERE user_id = ? AND book_id = ?",
		request.UserID, request.BookID).Scan(&existingReview)
	if err != nil {
		log.Println("❌ 查询已存在书评失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	// If a review already exists, return a conflict error / 如果书评已存在，则返回冲突错误
	if existingReview > 0 {
		log.Println("❌ 用户已对此书进行过评论:", request.BookID)
		http.Error(w, "You have already reviewed this book", http.StatusConflict)
		return
	}

	// Insert the new review into the Reviews table with the current timestamp / 将新的书评记录插入到 Reviews 表中，并记录当前时间
	_, err = tx.Exec(
		"INSERT INTO Reviews (user_id, book_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?)",
		request.UserID, request.BookID, request.Rating, request.Comment, time.Now(),
	)
	if err != nil {
		log.Println("❌ 插入书评失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Commit the transaction / 提交事务
	if err := tx.Commit(); err != nil {
		log.Println("❌ 提交事务失败:", err)
		http.Error(w, "Transaction error", http.StatusInternalServerError)
		return
	}

	// Return a success message in JSON format / 以 JSON 格式返回成功信息
	log.Println("✅ 书评添加成功:", request)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Review added successfully",
	})
}

// GetBookReviews 获取图书书评 (Get Book Reviews)
// @Summary 获取图书书评列表 (Retrieve reviews for a book)
// @Description 获取指定图书的所有用户书评，包括评分、内容和评论者 (Get all reviews for a specific book, including rating, comment, and reviewer)
// @Tags 书评 (Review)
// @Accept json
// @Produce json
// @Param bookId query string true "图书 ID (Book ID)"
// @Success 200 {array} map[string]interface{} "书评列表 (List of reviews)"
// @Failure 400 {object} map[string]string "缺少图书 ID (Book ID is required)"
// @Failure 500 {object} map[string]string "数据库错误 (Database error)"
// @Router /reviews [get]
func GetBookReviews(w http.ResponseWriter, r *http.Request) {
	// Extract the bookId from the URL query parameters / 从 URL 查询参数中提取 bookId
	vars := mux.Vars(r)
	bookID := vars["bookId"] 
	if bookID == "" {
		log.Println("❌ 缺少图书 ID")
		http.Error(w, "Book ID is required", http.StatusBadRequest)
		return
	}

	// Query the database to retrieve reviews and corresponding usernames / 查询数据库以获取书评和对应的用户名
	rows, err := config.DB.Query(`
        SELECT r.rating, r.comment, r.created_at, u.username 
        FROM Reviews r 
        JOIN Users u ON r.user_id = u.id 
        WHERE r.book_id = ?`,
		bookID)
	if err != nil {
		log.Println("❌ 查询书评失败:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// Prepare a slice to store the review records / 准备一个切片来存储书评记录
	var reviews []map[string]interface{}
	for rows.Next() {
		var rating int
		var comment string
		var createdAt time.Time
		var username string

		// Scan each row into corresponding variables / 将每一行数据扫描到对应的变量中
		if err := rows.Scan(&rating, &comment, &createdAt, &username); err != nil {
			log.Println("❌ 扫描书评数据失败:", err)
			continue
		}

		// Append the review data to the slice / 将书评数据添加到切片中
		reviews = append(reviews, map[string]interface{}{
			"rating":    rating,
			"comment":   comment,
			"createdAt": createdAt,
			"username":  username,
		})
	}

	// Return the reviews as a JSON response / 以 JSON 格式返回书评记录
	log.Println("✅ 获取书评成功，图书 ID:", bookID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reviews)
}
