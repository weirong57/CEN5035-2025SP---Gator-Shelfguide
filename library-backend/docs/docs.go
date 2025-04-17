// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/books": {
            "get": {
                "description": "获取图书列表，支持按关键词搜索 (Retrieve all books in the library, optionally filter by keyword)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书管理 (Book Management)"
                ],
                "summary": "获取所有图书 (Retrieve all books)",
                "parameters": [
                    {
                        "type": "string",
                        "description": "搜索关键词 (Search keyword)",
                        "name": "title",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "成功响应 (Success Response)",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/models.Book"
                            }
                        }
                    },
                    "500": {
                        "description": "服务器错误 (Server error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "将新图书添加到数据库中 (Add a new book with full information)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书管理 (Book Management)"
                ],
                "summary": "添加图书 (Add a new book to library)",
                "parameters": [
                    {
                        "description": "图书信息 (Book Information)",
                        "name": "book",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.Book"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "添加成功响应 (Success Response)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    },
                    "400": {
                        "description": "请求数据错误 (Invalid request body)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/books/{id}": {
            "get": {
                "description": "根据图书 ID 获取详细信息 (Retrieve detailed information of a specific book by ID)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书管理 (Book Management)"
                ],
                "summary": "获取单本图书信息 (Retrieve book details by ID)",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "图书 ID (Book ID)",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "成功响应 (Success Response)",
                        "schema": {
                            "$ref": "#/definitions/models.Book"
                        }
                    },
                    "400": {
                        "description": "无效 ID (Invalid book ID)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "图书未找到 (Book not found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "服务器错误 (Server error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "put": {
                "description": "根据图书 ID 更新对应信息 (Update book details by ID)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书管理 (Book Management)"
                ],
                "summary": "更新图书 (Update book by ID)",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "图书 ID (Book ID)",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "更新后的图书信息 (Updated Book Information)",
                        "name": "book",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.Book"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "更新成功 (Success Response)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "无效 ID 或数据错误 (Invalid book ID or body)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "图书未找到 (Book not found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "delete": {
                "description": "根据图书 ID 删除图书信息 (Delete a book record by its ID)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书管理 (Book Management)"
                ],
                "summary": "删除指定图书 (Delete a book by ID)",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "图书 ID (Book ID)",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "删除成功 (Success Response)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "无效 ID (Invalid book ID)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "图书未找到 (Book not found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "服务器错误 (Server error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/borrow": {
            "post": {
                "description": "用户借阅图书，库存 -1，并创建借阅记录 (User borrows a book, reduces available copies, and creates borrowing record)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "借阅管理 (Borrow Management)"
                ],
                "summary": "借阅图书 (User borrows a book)",
                "parameters": [
                    {
                        "description": "借阅请求参数 (Borrow Request)",
                        "name": "borrowRequest",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.BorrowRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "借阅成功 (Success Response)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    },
                    "400": {
                        "description": "请求数据错误 (Invalid request data)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "图书未找到或无库存 (Book not found or unavailable)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/borrow/return": {
            "post": {
                "description": "用户归还图书，更新记录与库存，计算逾期罚款 (User returns a borrowed book, updates record and stock, calculates fine)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "借阅管理 (Borrow Management)"
                ],
                "summary": "归还图书 (User returns a book)",
                "parameters": [
                    {
                        "description": "归还请求参数 (Return Request)",
                        "name": "returnRequest",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.BorrowRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "归还成功 (Success Response)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    },
                    "400": {
                        "description": "请求数据错误 (Invalid request data)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "无有效借阅记录 (No active borrow record found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/login": {
            "post": {
                "description": "User logs in and receives a JWT token",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Authentication"
                ],
                "summary": "User login and get JWT",
                "parameters": [
                    {
                        "description": "Login credentials",
                        "name": "credentials",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.LoginCredentials"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Login successful",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "401": {
                        "description": "Invalid username or password",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/register": {
            "post": {
                "description": "Allows a new user to register with username, password, and role",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Authentication"
                ],
                "summary": "Register a new user",
                "parameters": [
                    {
                        "description": "User information",
                        "name": "user",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.User"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Registration successful",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid request",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "Server error",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/reservations": {
            "get": {
                "description": "获取指定用户的所有图书预约信息，包括状态与时间 (Retrieve all reservation records for a specific user, including status and timestamps)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书预约 (Reservation)"
                ],
                "summary": "查询用户预约记录 (Retrieve reservation records of a user)",
                "parameters": [
                    {
                        "type": "string",
                        "description": "用户 ID (User ID)",
                        "name": "userId",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "预约记录列表 (List of reservations)",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "additionalProperties": true
                            }
                        }
                    },
                    "400": {
                        "description": "用户 ID 缺失 (User ID is required)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "用户预约图书，系统将创建状态为 PENDING 的记录 (User reserves a book; reservation is marked as PENDING)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书预约 (Reservation)"
                ],
                "summary": "创建图书预约 (Create a new book reservation)",
                "parameters": [
                    {
                        "description": "预约请求参数 (Reservation Request)",
                        "name": "reservation",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.ReservationRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "预约成功 (Reservation created successfully)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "无效请求数据 (Invalid request data)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "图书未找到 (Book not found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "409": {
                        "description": "已有未处理预约 (Active reservation already exists)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库或事务错误 (Database or transaction error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/reservations/cancel": {
            "post": {
                "description": "用户取消状态为 PENDING 的预约记录，更新状态为 CANCELLED (Cancel a PENDING reservation for a book)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "图书预约 (Reservation)"
                ],
                "summary": "取消图书预约 (Cancel an existing reservation)",
                "parameters": [
                    {
                        "description": "取消预约参数 (Reservation Request)",
                        "name": "reservation",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.ReservationRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "取消成功 (Reservation cancelled successfully)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "无效请求数据 (Invalid request data)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "404": {
                        "description": "未找到有效预约 (No active reservation found)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        },
        "/reviews": {
            "get": {
                "description": "获取指定图书的所有用户书评，包括评分、内容和评论者 (Get all reviews for a specific book, including rating, comment, and reviewer)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "书评 (Review)"
                ],
                "summary": "获取图书书评列表 (Retrieve reviews for a book)",
                "parameters": [
                    {
                        "type": "string",
                        "description": "图书 ID (Book ID)",
                        "name": "bookId",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "书评列表 (List of reviews)",
                        "schema": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "additionalProperties": true
                            }
                        }
                    },
                    "400": {
                        "description": "缺少图书 ID (Book ID is required)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库错误 (Database error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            },
            "post": {
                "description": "用户对已借阅的图书添加书评，支持评分和评论内容 (User adds a review to a book they have borrowed; includes rating and comment)",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "书评 (Review)"
                ],
                "summary": "添加图书书评 (Create a new review)",
                "parameters": [
                    {
                        "description": "书评请求参数 (Review Request)",
                        "name": "review",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/models.ReviewRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "添加成功 (Review added successfully)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "请求数据无效 (Invalid request data)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "403": {
                        "description": "仅可评论借阅过的书籍 (Only borrowed books can be reviewed)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "409": {
                        "description": "重复评论 (Already reviewed this book)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "500": {
                        "description": "数据库或事务错误 (Database or transaction error)",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "models.Book": {
            "type": "object",
            "properties": {
                "author": {
                    "description": "作者",
                    "type": "string",
                    "example": "John Doe"
                },
                "available_copies": {
                    "description": "可借数量",
                    "type": "integer",
                    "example": 3
                },
                "genre": {
                    "description": "类型",
                    "type": "string",
                    "example": "Programming"
                },
                "id": {
                    "description": "图书 ID",
                    "type": "integer",
                    "example": 101
                },
                "isbn": {
                    "description": "ISBN",
                    "type": "string",
                    "example": "9781234567890"
                },
                "language": {
                    "description": "语言",
                    "type": "string",
                    "example": "English"
                },
                "shelf_number": {
                    "description": "书架号",
                    "type": "string",
                    "example": "A-12"
                },
                "title": {
                    "description": "标题",
                    "type": "string",
                    "example": "Golang Basics"
                }
            }
        },
        "models.BorrowRequest": {
            "type": "object",
            "properties": {
                "bookId": {
                    "description": "图书 ID",
                    "type": "integer",
                    "example": 101
                },
                "userId": {
                    "description": "用户 ID",
                    "type": "integer",
                    "example": 1
                }
            }
        },
        "models.LoginCredentials": {
            "type": "object",
            "properties": {
                "password": {
                    "type": "string",
                    "example": "securePass123"
                },
                "username": {
                    "type": "string",
                    "example": "alice123"
                }
            }
        },
        "models.ReservationRequest": {
            "type": "object",
            "properties": {
                "bookId": {
                    "type": "integer",
                    "example": 101
                },
                "userId": {
                    "type": "integer",
                    "example": 1
                }
            }
        },
        "models.ReviewRequest": {
            "type": "object",
            "properties": {
                "bookId": {
                    "description": "图书 ID",
                    "type": "integer",
                    "example": 101
                },
                "comment": {
                    "description": "评论内容",
                    "type": "string",
                    "example": "Great book!"
                },
                "rating": {
                    "description": "评分（1-5）",
                    "type": "integer",
                    "example": 5
                },
                "userId": {
                    "description": "用户 ID",
                    "type": "integer",
                    "example": 1
                }
            }
        },
        "models.User": {
            "type": "object",
            "properties": {
                "password": {
                    "type": "string",
                    "example": "securePass123"
                },
                "role": {
                    "type": "string",
                    "example": "user"
                },
                "username": {
                    "type": "string",
                    "example": "alice123"
                }
            }
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:3000",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "Library Management API 文档",
	Description:      "This is the back-end API for an online library management system",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
