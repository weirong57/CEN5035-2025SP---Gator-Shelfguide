package models

type Admin struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Role     string `json:"role"`
}

type UpdateRoleRequest struct {
	Role string `json:"role" example:"admin"` // 目标角色
}
