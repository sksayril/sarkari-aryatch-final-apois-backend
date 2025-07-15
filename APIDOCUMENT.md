# API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Error Handling](#error-handling)
5. [User APIs](#user-apis)
6. [Admin APIs](#admin-apis)
7. [Employee APIs](#employee-apis)
8. [Public Category APIs](#public-category-apis)
9. [Public FAQ APIs](#public-faq-apis)
10. [Data Models](#data-models)
11. [Testing Examples](#testing-examples)

## Overview

This API provides a comprehensive system for managing users, employees, categories, and FAQs with role-based authentication. The system supports three user roles:

- **Users**: Can access public APIs without authentication
- **Employees**: Can update sub-categories and FAQs (created by admins)
- **Admins**: Can create employees, main categories, sub-categories, and FAQs

## Authentication

### JWT Token Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Token Generation

Tokens are automatically generated upon successful login and are valid for 24 hours.

## Base URL

```
http://localhost:3000
```

## Error Handling

All API responses follow a consistent error format:

```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## User APIs

### 1. User Signup

**Endpoint:** `POST /users/signup`

**Description:** Register a new user account

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

### 2. User Login

**Endpoint:** `POST /users/login`

**Description:** Authenticate a user and get access token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

---

## Admin APIs

### 1. Admin Signup

**Endpoint:** `POST /admin/signup`

**Description:** Create a new admin account

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (201):**
```json
{
  "message": "Admin created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Admin with this email already exists"
}
```

### 2. Admin Login

**Endpoint:** `POST /admin/login`

**Description:** Authenticate an admin and get access token

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### 3. Create Employee

**Endpoint:** `POST /admin/employees`

**Description:** Create a new employee account

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "name": "Employee Name",
  "email": "employee@example.com",
  "userId": "emp001",
  "password": "emp123"
}
```

**Response (201):**
```json
{
  "message": "Employee created successfully",
  "employee": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Employee Name",
    "email": "employee@example.com",
    "userId": "emp001"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Employee already exists"
}
```

### 4. Get All Employees

**Endpoint:** `GET /admin/employees`

**Description:** Retrieve all active employees

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "employees": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Employee Name",
      "email": "employee@example.com",
      "userId": "emp001",
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 5. Create Main Category

**Endpoint:** `POST /admin/categories/main`

**Description:** Create a new main category

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "title": "Technology"
}
```

**Response (201):**
```json
{
  "message": "Main category created successfully",
  "category": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Technology"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Category already exists"
}
```

### 6. Get All Main Categories (Admin)

**Endpoint:** `GET /admin/categories/main`

**Description:** Retrieve all main categories with creator information

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Technology",
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 7. Create Sub Category

**Endpoint:** `POST /admin/categories/sub`

**Description:** Create a new sub category with rich content

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "mainCategory": "64f8a1b2c3d4e5f6a7b8c9d0",
  "metaTitle": "Web Development",
  "metaDescription": "Learn web development from scratch",
  "keywords": ["web", "development", "programming", "coding"],
  "tags": ["tech", "coding", "frontend", "backend"],
  "contentTitle": "Complete Web Development Guide",
  "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide to web development...\n\n## HTML\n\nHTML is the backbone of web development...\n\n## CSS\n\nCSS makes your websites beautiful...\n\n## JavaScript\n\nJavaScript adds interactivity..."
}
```

**Response (201):**
```json
{
  "message": "Sub category created successfully",
  "subCategory": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "metaTitle": "Web Development",
    "contentTitle": "Complete Web Development Guide"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Main category not found"
}
```

### 8. Get All Sub Categories (Admin)

**Endpoint:** `GET /admin/categories/sub`

**Description:** Retrieve all sub categories with detailed information

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "subCategories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development from scratch",
      "keywords": ["web", "development", "programming", "coding"],
      "tags": ["tech", "coding", "frontend", "backend"],
      "contentTitle": "Complete Web Development Guide",
      "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
      "mainCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Technology"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 9. Create FAQ

**Endpoint:** `POST /admin/faqs`

**Description:** Create a new FAQ for a sub category

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Request Body:**
```json
{
  "subCategory": "64f8a1b2c3d4e5f6a7b8c9d2",
  "question": "What is HTML?",
  "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content using a system of elements and tags.",
  "order": 1
}
```

**Response (201):**
```json
{
  "message": "FAQ created successfully",
  "faq": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "question": "What is HTML?",
    "order": 1
  }
}
```

**Error Response (400):**
```json
{
  "message": "Sub category not found"
}
```

### 10. Get All FAQs (Admin)

**Endpoint:** `GET /admin/faqs`

**Description:** Retrieve all FAQs with detailed information

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null,
      "createdAt": "2023-09-05T10:30:00.000Z",
      "updatedAt": "2023-09-05T10:30:00.000Z"
    }
  ]
}
```

### 11. Get FAQs by Sub Category (Admin)

**Endpoint:** `GET /admin/faqs/subcategory/:subCategoryId`

**Description:** Retrieve all FAQs for a specific sub category

**Authentication:** Required (Admin)

**Headers:**
```
Authorization: Bearer <admin_jwt_token>
```

**Parameters:**
- `subCategoryId` (string, required): Sub category ID

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null
    }
  ]
}
```

---

## Employee APIs

### 1. Employee Login

**Endpoint:** `POST /employee/login`

**Description:** Authenticate an employee and get access token

**Authentication:** Not required

**Request Body:**
```json
{
  "userId": "emp001",
  "password": "emp123"
}
```

**Response (200):**
```json
{
  "message": "Employee login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "employee": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Employee Name",
    "email": "employee@example.com",
    "userId": "emp001"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```

### 2. Get All Sub Categories (Employee)

**Endpoint:** `GET /employee/subcategories`

**Description:** Retrieve all sub categories for employee viewing

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Response (200):**
```json
{
  "subCategories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development from scratch",
      "keywords": ["web", "development", "programming", "coding"],
      "tags": ["tech", "coding", "frontend", "backend"],
      "contentTitle": "Complete Web Development Guide",
      "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
      "mainCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Technology"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null
    }
  ]
}
```

### 3. Get Sub Category by ID

**Endpoint:** `GET /employee/subcategories/:id`

**Description:** Retrieve a specific sub category by ID

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Parameters:**
- `id` (string, required): Sub category ID

**Response (200):**
```json
{
  "subCategory": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "metaTitle": "Web Development",
    "metaDescription": "Learn web development from scratch",
    "keywords": ["web", "development", "programming", "coding"],
    "tags": ["tech", "coding", "frontend", "backend"],
    "contentTitle": "Complete Web Development Guide",
    "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
    "mainCategory": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Technology"
    },
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin",
      "email": "admin@example.com"
    },
    "updatedBy": null
  }
}
```

**Error Response (404):**
```json
{
  "message": "Sub category not found"
}
```

### 4. Update Sub Category

**Endpoint:** `PUT /employee/subcategories/:id`

**Description:** Update a sub category (employees can only update, not delete)

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Parameters:**
- `id` (string, required): Sub category ID

**Request Body:**
```json
{
  "metaTitle": "Updated Web Development Guide",
  "metaDescription": "Updated description for web development",
  "keywords": ["web", "development", "programming", "coding", "updated"],
  "tags": ["tech", "coding", "frontend", "backend", "new"],
  "contentTitle": "Updated Web Development Guide",
  "contentDescription": "# Updated Web Development Guide\n\n## New Introduction\n\nThis is an updated comprehensive guide...\n\n## New Section\n\nAdded new content here..."
}
```

**Response (200):**
```json
{
  "message": "Sub category updated successfully",
  "subCategory": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "metaTitle": "Updated Web Development Guide",
    "contentTitle": "Updated Web Development Guide",
    "updatedBy": "64f8a1b2c3d4e5f6a7b8c9d3"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Sub category not found"
}
```

### 5. Get All FAQs (Employee)

**Endpoint:** `GET /employee/faqs`

**Description:** Retrieve all FAQs for employee viewing

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null
    }
  ]
}
```

### 6. Get FAQs by Sub Category (Employee)

**Endpoint:** `GET /employee/faqs/subcategory/:subCategoryId`

**Description:** Retrieve all FAQs for a specific sub category

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Parameters:**
- `subCategoryId` (string, required): Sub category ID

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      },
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin",
        "email": "admin@example.com"
      },
      "updatedBy": null
    }
  ]
}
```

### 7. Get FAQ by ID (Employee)

**Endpoint:** `GET /employee/faqs/:id`

**Description:** Retrieve a specific FAQ by ID

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Parameters:**
- `id` (string, required): FAQ ID

**Response (200):**
```json
{
  "faq": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "question": "What is HTML?",
    "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
    "order": 1,
    "subCategory": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "contentTitle": "Complete Web Development Guide"
    },
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin",
      "email": "admin@example.com"
    },
    "updatedBy": null
  }
}
```

**Error Response (404):**
```json
{
  "message": "FAQ not found"
}
```

### 8. Update FAQ

**Endpoint:** `PUT /employee/faqs/:id`

**Description:** Update a FAQ (employees can only update, not delete)

**Authentication:** Required (Employee)

**Headers:**
```
Authorization: Bearer <employee_jwt_token>
```

**Parameters:**
- `id` (string, required): FAQ ID

**Request Body:**
```json
{
  "question": "What is HTML and how does it work?",
  "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of web content using a system of elements and tags. HTML elements tell the browser how to display the content.",
  "order": 1
}
```

**Response (200):**
```json
{
  "message": "FAQ updated successfully",
  "faq": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "question": "What is HTML and how does it work?",
    "order": 1,
    "updatedBy": "64f8a1b2c3d4e5f6a7b8c9d4"
  }
}
```

**Error Response (404):**
```json
{
  "message": "FAQ not found"
}
```

---

## Public Category APIs

### 1. Get All Main Categories

**Endpoint:** `GET /category/main`

**Description:** Retrieve all active main categories (public access)

**Authentication:** Not required

**Response (200):**
```json
{
  "categories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Technology"
    },
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d4",
      "title": "Science"
    }
  ]
}
```

### 2. Get Main Category by ID

**Endpoint:** `GET /category/main/:id`

**Description:** Retrieve a specific main category by ID

**Authentication:** Not required

**Parameters:**
- `id` (string, required): Main category ID

**Response (200):**
```json
{
  "category": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Technology"
  }
}
```

**Error Response (404):**
```json
{
  "message": "Category not found"
}
```

### 3. Get All Sub Categories

**Endpoint:** `GET /category/sub`

**Description:** Retrieve all active sub categories (public access)

**Authentication:** Not required

**Response (200):**
```json
{
  "subCategories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development from scratch",
      "keywords": ["web", "development", "programming", "coding"],
      "tags": ["tech", "coding", "frontend", "backend"],
      "contentTitle": "Complete Web Development Guide",
      "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
      "mainCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Technology"
      }
    }
  ]
}
```

### 4. Get Sub Categories by Main Category

**Endpoint:** `GET /category/sub/main/:mainCategoryId`

**Description:** Retrieve all sub categories under a specific main category

**Authentication:** Not required

**Parameters:**
- `mainCategoryId` (string, required): Main category ID

**Response (200):**
```json
{
  "subCategories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development from scratch",
      "keywords": ["web", "development", "programming", "coding"],
      "tags": ["tech", "coding", "frontend", "backend"],
      "contentTitle": "Complete Web Development Guide",
      "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
      "mainCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Technology"
      }
    }
  ]
}
```

### 5. Get Sub Category by ID

**Endpoint:** `GET /category/sub/:id`

**Description:** Retrieve a specific sub category by ID

**Authentication:** Not required

**Parameters:**
- `id` (string, required): Sub category ID

**Response (200):**
```json
{
  "subCategory": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "metaTitle": "Web Development",
    "metaDescription": "Learn web development from scratch",
    "keywords": ["web", "development", "programming", "coding"],
    "tags": ["tech", "coding", "frontend", "backend"],
    "contentTitle": "Complete Web Development Guide",
    "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
    "mainCategory": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Technology"
    }
  }
}
```

**Error Response (404):**
```json
{
  "message": "Sub category not found"
}
```

### 6. Search Sub Categories

**Endpoint:** `GET /category/sub/search/:query`

**Description:** Search sub categories by title, keywords, or tags

**Authentication:** Not required

**Parameters:**
- `query` (string, required): Search term

**Response (200):**
```json
{
  "subCategories": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development from scratch",
      "keywords": ["web", "development", "programming", "coding"],
      "tags": ["tech", "coding", "frontend", "backend"],
      "contentTitle": "Complete Web Development Guide",
      "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide...",
      "mainCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "title": "Technology"
      }
    }
  ]
}
```

---

## Public FAQ APIs

### 1. Get All FAQs

**Endpoint:** `GET /category/faqs`

**Description:** Retrieve all active FAQs (public access)

**Authentication:** Not required

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      }
    }
  ]
}
```

### 2. Get FAQs by Sub Category

**Endpoint:** `GET /category/faqs/subcategory/:subCategoryId`

**Description:** Retrieve all FAQs for a specific sub category

**Authentication:** Not required

**Parameters:**
- `subCategoryId` (string, required): Sub category ID

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      }
    }
  ]
}
```

### 3. Get FAQ by ID

**Endpoint:** `GET /category/faqs/:id`

**Description:** Retrieve a specific FAQ by ID

**Authentication:** Not required

**Parameters:**
- `id` (string, required): FAQ ID

**Response (200):**
```json
{
  "faq": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "question": "What is HTML?",
    "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
    "order": 1,
    "subCategory": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "metaTitle": "Web Development",
      "contentTitle": "Complete Web Development Guide"
    }
  }
}
```

**Error Response (404):**
```json
{
  "message": "FAQ not found"
}
```

### 4. Search FAQs

**Endpoint:** `GET /category/faqs/search/:query`

**Description:** Search FAQs by question or answer content

**Authentication:** Not required

**Parameters:**
- `query` (string, required): Search term

**Response (200):**
```json
{
  "faqs": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d3",
      "question": "What is HTML?",
      "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
      "order": 1,
      "subCategory": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
        "metaTitle": "Web Development",
        "contentTitle": "Complete Web Development Guide"
      }
    }
  ]
}
```

---

## Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user'], default: 'user'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Employee Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  userId: String (required, unique),
  password: String (required, hashed),
  createdBy: ObjectId (ref: User, required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### MainCategory Model
```javascript
{
  title: String (required, unique),
  createdBy: ObjectId (ref: User, required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### SubCategory Model
```javascript
{
  mainCategory: ObjectId (ref: MainCategory, required),
  metaTitle: String (required),
  metaDescription: String,
  keywords: [String],
  tags: [String],
  contentTitle: String (required),
  contentDescription: String (supports markdown),
  createdBy: ObjectId (ref: User, required),
  updatedBy: ObjectId (ref: Employee),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### FAQ Model
```javascript
{
  subCategory: ObjectId (ref: SubCategory, required),
  question: String (required),
  answer: String (required),
  order: Number (default: 0),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User, required),
  updatedBy: ObjectId (ref: Employee),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing Examples

### Using cURL

#### 1. User Signup
```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### 2. Admin Signup
```bash
curl -X POST http://localhost:3000/admin/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

#### 3. Admin Login
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

#### 4. Create Employee (with admin token)
```bash
curl -X POST http://localhost:3000/admin/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Employee Name",
    "email": "employee@example.com",
    "userId": "emp001",
    "password": "emp123"
  }'
```

#### 5. Create Main Category (with admin token)
```bash
curl -X POST http://localhost:3000/admin/categories/main \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Technology"
  }'
```

#### 6. Create Sub Category (with admin token)
```bash
curl -X POST http://localhost:3000/admin/categories/sub \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "mainCategory": "MAIN_CATEGORY_ID",
    "metaTitle": "Web Development",
    "metaDescription": "Learn web development from scratch",
    "keywords": ["web", "development", "programming"],
    "tags": ["tech", "coding"],
    "contentTitle": "Complete Web Development Guide",
    "contentDescription": "# Web Development Guide\n\n## Introduction\n\nThis is a comprehensive guide..."
  }'
```

#### 7. Create FAQ (with admin token)
```bash
curl -X POST http://localhost:3000/admin/faqs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "subCategory": "SUB_CATEGORY_ID",
    "question": "What is HTML?",
    "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
    "order": 1
  }'
```

#### 8. Employee Login
```bash
curl -X POST http://localhost:3000/employee/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "emp001",
    "password": "emp123"
  }'
```

#### 9. Update Sub Category (with employee token)
```bash
curl -X PUT http://localhost:3000/employee/subcategories/SUB_CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EMPLOYEE_TOKEN" \
  -d '{
    "metaTitle": "Updated Web Development Guide",
    "contentDescription": "# Updated Guide\n\n## New Content\n\nUpdated markdown content..."
  }'
```

#### 10. Update FAQ (with employee token)
```bash
curl -X PUT http://localhost:3000/employee/faqs/FAQ_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_EMPLOYEE_TOKEN" \
  -d '{
    "question": "What is HTML and how does it work?",
    "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
    "order": 1
  }'
```

#### 11. Get Public Categories
```bash
curl -X GET http://localhost:3000/category/main
```

```bash
curl -X GET http://localhost:3000/category/sub
```

#### 12. Get Public FAQs
```bash
curl -X GET http://localhost:3000/category/faqs
```

```bash
curl -X GET http://localhost:3000/category/faqs/subcategory/SUB_CATEGORY_ID
```

### Using Postman

1. **Set up a new collection** for your API
2. **Create environment variables** for base URL and tokens
3. **Import the following requests:**

#### User Signup
- Method: POST
- URL: `{{baseUrl}}/users/signup`
- Body (raw JSON):
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Admin Signup
- Method: POST
- URL: `{{baseUrl}}/admin/signup`
- Body (raw JSON):
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Admin Login
- Method: POST
- URL: `{{baseUrl}}/admin/login`
- Body (raw JSON):
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

#### Create Employee
- Method: POST
- URL: `{{baseUrl}}/admin/employees`
- Headers: `Authorization: Bearer {{adminToken}}`
- Body (raw JSON):
```json
{
  "name": "Employee Name",
  "email": "employee@example.com",
  "userId": "emp001",
  "password": "emp123"
}
```

#### Create FAQ
- Method: POST
- URL: `{{baseUrl}}/admin/faqs`
- Headers: `Authorization: Bearer {{adminToken}}`
- Body (raw JSON):
```json
{
  "subCategory": "SUB_CATEGORY_ID",
  "question": "What is HTML?",
  "answer": "HTML (HyperText Markup Language) is the standard markup language for creating web pages...",
  "order": 1
}
```

### Environment Variables for Postman

```json
{
  "baseUrl": "http://localhost:3000",
  "adminToken": "your_admin_jwt_token",
  "employeeToken": "your_employee_jwt_token",
  "userToken": "your_user_jwt_token"
}
```

---

## Security Notes

1. **Password Security**: All passwords are hashed using bcrypt with salt rounds of 10
2. **Token Security**: JWT tokens expire after 24 hours
3. **Role-based Access**: Different endpoints require different user roles
4. **Input Validation**: All inputs are validated before processing
5. **Error Handling**: Comprehensive error handling prevents information leakage

## Rate Limiting

Currently, the API does not implement rate limiting. For production use, consider implementing rate limiting middleware.

## CORS

The API supports CORS for cross-origin requests. Configure the allowed origins as needed for your application.

---

This documentation covers all available endpoints and provides comprehensive examples for testing and integration. 