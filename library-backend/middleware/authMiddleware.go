package middleware

import (
	"context"
	"fmt"
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
		if authHeader == "" {
			http.Error(w, "No token provided", http.StatusUnauthorized)
			return
		}

		// 获取 token（Bearer <TOKEN>）
		// Get token (Bearer <TOKEN>)
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}
		tokenString := tokenParts[1]

		// 解析 JWT 令牌
		// Parse JWT token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusForbidden)
			return
		}

		// 解析 claims
		// Parse JWT claims
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			// 确保 userId 是 int 类型
			// Ensure userId is an int type
			userIDFloat, ok := claims["userId"].(float64)
			if !ok {
				http.Error(w, "Invalid token payload", http.StatusUnauthorized)
				return
			}
			userID := int(userIDFloat)

			// 获取角色
			// Get role
			role, ok := claims["role"].(string)
			if !ok {
				http.Error(w, "Invalid token payload", http.StatusUnauthorized)
				return
			}

			// 存储到请求上下文
			// Store to request context

			ctx := context.WithValue(r.Context(), "userID", userID)
			ctx = context.WithValue(ctx, "role", role)

			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		http.Error(w, "Invalid token", http.StatusUnauthorized)
	})
}

// IsAdmin 检查是否为管理员
// IsAdmin Check if you are an administrator
func IsAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 从上下文获取角色
		// Getting roles from context
		role, ok := r.Context().Value("role").(string)
		if !ok || role != "admin" {
			http.Error(w, "Admin role required", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
