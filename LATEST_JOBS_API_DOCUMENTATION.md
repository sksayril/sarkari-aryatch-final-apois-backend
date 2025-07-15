# Latest Jobs API Documentation

## Overview
The Latest Jobs API provides functionality to manage job-related content across different categories: Results, Admit Cards, Answer Keys, Syllabus, Admission, and Importance. Each entry includes meta information (title, description, tags, keywords) and content (title, description). This API supports role-based access with admin-only management and public read access.

## Base URL
```
http://localhost:3000/latest-jobs
```

## Authentication
- Admin routes require JWT token in Authorization header: `Bearer <token>`
- Public routes require no authentication

## Categories
- **Results**: Job results and outcomes
- **AdmitCards**: Admission cards and hall tickets
- **AnswerKey**: Answer keys and solutions
- **Syllabus**: Course syllabus and curriculum
- **Admission**: Admission information and procedures
- **Importance**: Important notices and announcements

## API Endpoints

### Admin Routes (Require Authentication)

#### 1. Create Latest Job
**POST** `/admin/create`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "Results",
  "metaTitle": "UPSC Civil Services Results 2024",
  "metaDescription": "Latest UPSC Civil Services examination results for 2024",
  "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
  "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
  "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
  "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Latest job created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "category": "Results",
    "metaTitle": "UPSC Civil Services Results 2024",
    "metaDescription": "Latest UPSC Civil Services examination results for 2024",
    "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
    "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
    "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
    "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
    "isActive": true,
    "createdBy": "60f7b3b3b3b3b3b3b3b3b3b4",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 2. Get All Latest Jobs (Admin)
**GET** `/admin/all`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in meta title, content title, and description
- `category` (optional): Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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

#### 3. Get Single Latest Job (Admin)
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
    "category": "Results",
    "metaTitle": "UPSC Civil Services Results 2024",
    "metaDescription": "Latest UPSC Civil Services examination results for 2024",
    "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
    "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
    "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
    "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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

#### 4. Update Latest Job (Admin)
**PUT** `/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "category": "AdmitCards",
  "metaTitle": "Updated UPSC Admit Card 2024",
  "metaDescription": "Updated description",
  "metaTags": ["UPSC", "Admit Card", "2024"],
  "keywords": ["UPSC", "Admit Card", "Hall Ticket"],
  "contentTitle": "UPSC Admit Card 2024 Download",
  "contentDescription": "Download your UPSC Civil Services admit card for 2024 examination.",
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Latest job updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "category": "AdmitCards",
    "metaTitle": "Updated UPSC Admit Card 2024",
    "metaDescription": "Updated description",
    "metaTags": ["UPSC", "Admit Card", "2024"],
    "keywords": ["UPSC", "Admit Card", "Hall Ticket"],
    "contentTitle": "UPSC Admit Card 2024 Download",
    "contentDescription": "Download your UPSC Civil Services admit card for 2024 examination.",
    "isActive": true,
    "createdBy": {...},
    "updatedBy": {...},
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

#### 5. Delete Latest Job (Admin)
**DELETE** `/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Latest job deleted successfully"
}
```

#### 6. Get Latest Jobs by Category (Admin)
**GET** `/admin/category/:category`

**Headers:**
```
Authorization: Bearer <admin_token>
```

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
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
      "isActive": true,
      "createdBy": {...},
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

### Public Routes (No Authentication Required)

#### 1. Get All Active Latest Jobs
**GET** `/public/all`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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

#### 2. Get Latest Jobs by Category (Public)
**GET** `/public/category/:category`

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
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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

#### 3. Get Results (Public)
**GET** `/public/results`

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
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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

#### 4. Get AdmitCards (Public)
**GET** `/public/admitcards`

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
      "category": "AdmitCards",
      "metaTitle": "UPSC Admit Card 2024",
      "metaDescription": "Download UPSC Civil Services admit card for 2024",
      "metaTags": ["UPSC", "Admit Card", "Hall Ticket", "2024"],
      "keywords": ["UPSC", "Admit Card", "Hall Ticket", "Download"],
      "contentTitle": "UPSC Admit Card 2024 Download",
      "contentDescription": "Download your UPSC Civil Services admit card for 2024 examination.",
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

#### 5. Get AnswerKey (Public)
**GET** `/public/answerkey`

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
      "category": "AnswerKey",
      "metaTitle": "UPSC Answer Key 2024",
      "metaDescription": "UPSC Civil Services answer key and solutions for 2024",
      "metaTags": ["UPSC", "Answer Key", "Solutions", "2024"],
      "keywords": ["UPSC", "Answer Key", "Solutions", "Exam"],
      "contentTitle": "UPSC Answer Key 2024 Released",
      "contentDescription": "UPSC has released the answer key for Civil Services Examination 2024. Check your answers here.",
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

#### 6. Get Syllabus (Public)
**GET** `/public/syllabus`

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
      "category": "Syllabus",
      "metaTitle": "UPSC Syllabus 2024",
      "metaDescription": "Complete UPSC Civil Services syllabus for 2024 examination",
      "metaTags": ["UPSC", "Syllabus", "Curriculum", "2024"],
      "keywords": ["UPSC", "Syllabus", "Curriculum", "Exam Pattern"],
      "contentTitle": "UPSC Civil Services Syllabus 2024",
      "contentDescription": "Complete syllabus for UPSC Civil Services Examination 2024. Download the detailed curriculum here.",
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

#### 7. Get Admission (Public)
**GET** `/public/admission`

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
      "category": "Admission",
      "metaTitle": "UPSC Admission 2024",
      "metaDescription": "UPSC Civil Services admission information and procedures for 2024",
      "metaTags": ["UPSC", "Admission", "Application", "2024"],
      "keywords": ["UPSC", "Admission", "Application", "Registration"],
      "contentTitle": "UPSC Civil Services Admission 2024",
      "contentDescription": "Complete admission information for UPSC Civil Services Examination 2024. Apply online now.",
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

#### 8. Get Importance (Public)
**GET** `/public/importance`

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
      "category": "Importance",
      "metaTitle": "Important UPSC Notice 2024",
      "metaDescription": "Important notices and announcements for UPSC Civil Services 2024",
      "metaTags": ["UPSC", "Important", "Notice", "2024"],
      "keywords": ["UPSC", "Important", "Notice", "Announcement"],
      "contentTitle": "Important UPSC Notice 2024",
      "contentDescription": "Important notice regarding UPSC Civil Services Examination 2024. Read all details here.",
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

#### 3. Get Single Latest Job (Public)
**GET** `/public/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "category": "Results",
    "metaTitle": "UPSC Civil Services Results 2024",
    "metaDescription": "Latest UPSC Civil Services examination results for 2024",
    "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
    "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
    "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
    "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 4. Search Latest Jobs (Public)
**GET** `/public/search`

**Query Parameters:**
- `q` (required): Search query
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "category": "Results",
      "metaTitle": "UPSC Civil Services Results 2024",
      "metaDescription": "Latest UPSC Civil Services examination results for 2024",
      "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
      "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
      "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
      "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here.",
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
  "message": "Category, meta title, meta description, content title, and content description are required"
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
  "message": "Latest job not found"
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

### 1. Create Latest Job (Admin)
```bash
curl -X POST http://localhost:3000/latest-jobs/admin/create \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Results",
    "metaTitle": "UPSC Civil Services Results 2024",
    "metaDescription": "Latest UPSC Civil Services examination results for 2024",
    "metaTags": ["UPSC", "Civil Services", "Results", "2024"],
    "keywords": ["UPSC", "Civil Services", "Results", "Government Jobs"],
    "contentTitle": "UPSC Civil Services Final Results 2024 Declared",
    "contentDescription": "The Union Public Service Commission has declared the final results for Civil Services Examination 2024. Check your result here."
  }'
```

### 2. Get Latest Jobs by Category (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/category/Results?page=1&limit=5"
```

### 3. Get Results (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/results?page=1&limit=5"
```

### 4. Get AdmitCards (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/admitcards?page=1&limit=5"
```

### 5. Get AnswerKey (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/answerkey?page=1&limit=5"
```

### 6. Get Syllabus (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/syllabus?page=1&limit=5"
```

### 7. Get Admission (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/admission?page=1&limit=5"
```

### 8. Get Importance (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/importance?page=1&limit=5"
```

### 3. Search Latest Jobs (Public)
```bash
curl -X GET "http://localhost:3000/latest-jobs/public/search?q=UPSC&category=Results&page=1&limit=5"
```

### 4. Update Latest Job (Admin)
```bash
curl -X PUT http://localhost:3000/latest-jobs/admin/JOB_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "AdmitCards",
    "metaTitle": "Updated UPSC Admit Card 2024",
    "contentTitle": "UPSC Admit Card 2024 Download"
  }'
```

### 5. Get All Latest Jobs with Search (Admin)
```bash
curl -X GET "http://localhost:3000/latest-jobs/admin/all?search=UPSC&category=Results&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Features

### Role-Based Access
- **Admin**: Full CRUD operations (Create, Read, Update, Delete)
- **Public**: Read-only access to active content

### Categories Supported
- **Results**: Job results and outcomes
- **AdmitCards**: Admission cards and hall tickets
- **AnswerKey**: Answer keys and solutions
- **Syllabus**: Course syllabus and curriculum
- **Admission**: Admission information and procedures
- **Importance**: Important notices and announcements

### Data Validation
- Required fields validation
- Category validation
- Meta information validation
- Content validation

### Security Features
- JWT authentication for admin routes
- Input sanitization
- Error handling

### Performance Features
- Pagination support
- Search functionality across multiple fields
- Category filtering
- Database indexing
- Selective field projection for public routes

### Content Management
- Active/inactive status control
- Audit trail (created by, updated by)
- Timestamp tracking
- Meta information management
- SEO-friendly structure

### Search Capabilities
- Search in meta title
- Search in content title
- Search in content description
- Search in keywords
- Category-specific search 