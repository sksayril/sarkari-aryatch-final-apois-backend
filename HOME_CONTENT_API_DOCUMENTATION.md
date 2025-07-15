# Home Content API Documentation

## Overview
The Home Content API provides functionality to manage home page content including title, description, Telegram link, WhatsApp link, and FAQs. This API supports role-based access with admin-only management and public read access.

## Base URL
```
http://localhost:3000/home-content
```

## Authentication
- Admin routes require JWT token in Authorization header: `Bearer <token>`
- Public routes require no authentication

## API Endpoints

### Admin Routes (Require Authentication)

#### 1. Create Home Content
**POST** `/admin/create`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Welcome to Our Platform",
  "description": "Your trusted source for information and services",
  "telegramLink": "https://t.me/yourchannel",
  "whatsappLink": "https://wa.me/1234567890",
  "faqs": [
    {
      "question": "How do I get started?",
      "answer": "Simply sign up and explore our services."
    },
    {
      "question": "What services do you offer?",
      "answer": "We offer a wide range of information and support services."
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Home content created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Welcome to Our Platform",
    "description": "Your trusted source for information and services",
    "telegramLink": "https://t.me/yourchannel",
    "whatsappLink": "https://wa.me/1234567890",
    "faqs": [
      {
        "question": "How do I get started?",
        "answer": "Simply sign up and explore our services."
      },
      {
        "question": "What services do you offer?",
        "answer": "We offer a wide range of information and support services."
      }
    ],
    "isActive": true,
    "createdBy": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get All Home Content (Admin)
**GET** `/admin/all`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and description

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Welcome to Our Platform",
      "description": "Your trusted source for information and services",
      "telegramLink": "https://t.me/yourchannel",
      "whatsappLink": "https://wa.me/1234567890",
      "faqs": [...],
      "isActive": true,
      "createdBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

#### 3. Get Single Home Content (Admin)
**GET** `/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Welcome to Our Platform",
    "description": "Your trusted source for information and services",
    "telegramLink": "https://t.me/yourchannel",
    "whatsappLink": "https://wa.me/1234567890",
    "faqs": [...],
    "isActive": true,
    "createdBy": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "updatedBy": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:30:00.000Z"
  }
}
```

#### 4. Update Home Content (Admin)
**PUT** `/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Welcome Message",
  "description": "Updated description",
  "telegramLink": "https://t.me/updatedchannel",
  "whatsappLink": "https://wa.me/9876543210",
  "faqs": [
    {
      "question": "Updated question?",
      "answer": "Updated answer."
    }
  ],
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Home content updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Updated Welcome Message",
    "description": "Updated description",
    "telegramLink": "https://t.me/updatedchannel",
    "whatsappLink": "https://wa.me/9876543210",
    "faqs": [...],
    "isActive": true,
    "createdBy": {...},
    "updatedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

#### 5. Delete Home Content (Admin)
**DELETE** `/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Home content deleted successfully"
}
```

### Public Routes (No Authentication Required)

#### 1. Get Active Home Content
**GET** `/public/active`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Welcome to Our Platform",
    "description": "Your trusted source for information and services",
    "telegramLink": "https://t.me/yourchannel",
    "whatsappLink": "https://wa.me/1234567890",
    "faqs": [
      {
        "question": "How do I get started?",
        "answer": "Simply sign up and explore our services."
      },
      {
        "question": "What services do you offer?",
        "answer": "We offer a wide range of information and support services."
      }
    ],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get All Active Home Content (Paginated)
**GET** `/public/all`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Welcome to Our Platform",
      "description": "Your trusted source for information and services",
      "telegramLink": "https://t.me/yourchannel",
      "whatsappLink": "https://wa.me/1234567890",
      "faqs": [...],
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 10
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Title, description, Telegram link, and WhatsApp link are required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. Admin token required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Home content not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Testing Examples

### 1. Create Home Content (Admin)
```bash
curl -X POST http://localhost:3000/home-content/admin/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Welcome to Our Platform",
    "description": "Your trusted source for information and services",
    "telegramLink": "https://t.me/yourchannel",
    "whatsappLink": "https://wa.me/1234567890",
    "faqs": [
      {
        "question": "How do I get started?",
        "answer": "Simply sign up and explore our services."
      }
    ]
  }'
```

### 2. Get Active Home Content (Public)
```bash
curl -X GET http://localhost:3000/home-content/public/active
```

### 3. Update Home Content (Admin)
```bash
curl -X PUT http://localhost:3000/home-content/admin/HOME_CONTENT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Welcome Message",
    "description": "Updated description"
  }'
```

### 4. Get All Home Content with Search (Admin)
```bash
curl -X GET "http://localhost:3000/home-content/admin/all?search=welcome&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Features

### Role-Based Access
- **Admin**: Full CRUD operations (Create, Read, Update, Delete)
- **Public**: Read-only access to active content

### Data Validation
- Required fields validation
- FAQ structure validation
- URL format validation for social links

### Security Features
- JWT authentication for admin routes
- Input sanitization
- Error handling

### Performance Features
- Pagination support
- Search functionality
- Database indexing
- Selective field projection for public routes

### Content Management
- Active/inactive status control
- Audit trail (created by, updated by)
- Timestamp tracking
- FAQ management within content 