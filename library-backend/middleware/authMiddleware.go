package middleware

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// VerifyToken 验证 JWT 令牌
// VerifyToken verifies the JWT token.
func VerifyToken(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        authHeader := r.Header.Get("Authorization")

        log.Println("Authorization Header:", authHeader) // 这里添加日志输出


        if authHeader == "" {
            log.Println("❌ Authorization header is missing")
            http.Error(w, "No token provided", http.StatusUnauthorized)
            return
        }

        // 获取 token（Bearer <TOKEN>）
        tokenParts := strings.Split(authHeader, " ")
        if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
            log.Println("❌ Invalid token format. Expected: 'Bearer <TOKEN>'")
            http.Error(w, "Invalid token format", http.StatusUnauthorized)
            return
        }
        tokenString := tokenParts[1]

        log.Println("JWT_SECRET:", os.Getenv("JWT_SECRET")) // 输出 JWT_SECRET 环境变量的值


        // 解析 JWT 令牌
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            // 验证签名方法是否为 HMAC
            if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
                return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
            }
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        // 如果 token 解析失败或无效，返回错误
        if err != nil || !token.Valid {
            log.Println("❌ Invalid token:", err) // 输出错误信息
            http.Error(w, "Invalid token", http.StatusForbidden)
            return
        }

        // 输出 token 进行调试
        log.Println("🔑 Verifying token:", tokenString)

        // 解析 claims
        if claims, ok := token.Claims.(jwt.MapClaims); ok {
            // 确保 userId 是 int 类型
            userIDFloat, ok := claims["userId"].(float64)
            if !ok {
                log.Println("❌ Invalid token payload: userId is missing or not a valid integer")
                http.Error(w, "Invalid token payload", http.StatusUnauthorized)
                return
            }
            userID := int(userIDFloat)

            // 获取角色
            role, ok := claims["role"].(string)
            if !ok {
                log.Println("❌ Invalid token payload: role is missing or not a valid string")
                http.Error(w, "Invalid token payload", http.StatusUnauthorized)
                return
            }

            log.Println("UserID:", userID, "Role:", role) // 输出 UserID 和 Role 信息

            // 将用户 ID 和角色存储到请求上下文
            ctx := context.WithValue(r.Context(), "userID", userID)
            ctx = context.WithValue(ctx, "role", role)

            // 调用下一个处理函数
            next.ServeHTTP(w, r.WithContext(ctx))
            return
        }

        // 如果无法解析 claims，返回错误
        http.Error(w, "Invalid token", http.StatusUnauthorized)
    })
}

// IsAdmin 检查是否为管理员
// IsAdmin Check if you are an administrator
func IsAdmin(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // 从上下文获取角色
        role, ok := r.Context().Value("role").(string)
        if !ok || role != "admin" {
            log.Println("❌ Admin role required. User role:", role) // 打印用户角色
            http.Error(w, "Admin role required", http.StatusForbidden)
            return
        }

        next.ServeHTTP(w, r)
    })
}
