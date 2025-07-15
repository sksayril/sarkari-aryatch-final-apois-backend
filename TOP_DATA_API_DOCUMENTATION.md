# Top Data API Documentation

## Overview
The Top Data API provides functionality to manage top-level content data with meta information (title, description, keywords, tags) and content (title, description) along with color coding. This API supports role-based access with admin-only management and includes features for SEO optimization.

## Base URL
```
http://localhost:3000/admin/topdata
```

## Authentication
- All routes require JWT token in Authorization header: `Bearer <admin_token>`
- Admin role required for all operations

## Data Model
```javascript
{
  metaTitle: String (required),
  metaDescription: String,
  keywords: [String],
  tags: [String],
  contentTitle: String (required),
  contentDescription: String,
  colorCode: String (default: '#000000'),
  createdBy: ObjectId (ref: User),
  updatedBy: ObjectId (ref: Employee),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### 1. Create Top Data
**POST** `/admin/topdata`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "metaTitle": "UPSC Civil Services 2024",
  "metaDescription": "Complete guide for UPSC Civil Services Examination 2024",
  "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024"],
  "tags": ["UPSC", "Civil Services", "Exam"],
  "contentTitle": "UPSC Civil Services Examination 2024",
  "contentDescription": "Complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
  "colorCode": "#FF6B35"
}
```

**Response (201):**
```json
{
  "message": "Top data created successfully",
  "topData": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "metaTitle": "UPSC Civil Services 2024",
    "contentTitle": "UPSC Civil Services Examination 2024",
    "colorCode": "#FF6B35"
  }
}
```

### 2. Get All Top Data
**GET** `/admin/topdata`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "topDataList": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "metaTitle": "UPSC Civil Services 2024",
      "metaDescription": "Complete guide for UPSC Civil Services Examination 2024",
      "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024"],
      "tags": ["UPSC", "Civil Services", "Exam"],
      "contentTitle": "UPSC Civil Services Examination 2024",
      "contentDescription": "Complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
      "colorCode": "#FF6B35",
      "isActive": true,
      "createdBy": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "updatedBy": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Top Data
**GET** `/admin/topdata/:id`

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
    "metaTitle": "UPSC Civil Services 2024",
    "metaDescription": "Complete guide for UPSC Civil Services Examination 2024",
    "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024"],
    "tags": ["UPSC", "Civil Services", "Exam"],
    "contentTitle": "UPSC Civil Services Examination 2024",
    "contentDescription": "Complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
    "colorCode": "#FF6B35",
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

### 4. Update Top Data
**PUT** `/admin/topdata/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "metaTitle": "Updated UPSC Civil Services 2024",
  "metaDescription": "Updated complete guide for UPSC Civil Services Examination 2024",
  "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024", "Updated"],
  "tags": ["UPSC", "Civil Services", "Exam", "Updated"],
  "contentTitle": "Updated UPSC Civil Services Examination 2024",
  "contentDescription": "Updated complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
  "colorCode": "#FF8C42",
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Top data updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "metaTitle": "Updated UPSC Civil Services 2024",
    "metaDescription": "Updated complete guide for UPSC Civil Services Examination 2024",
    "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024", "Updated"],
    "tags": ["UPSC", "Civil Services", "Exam", "Updated"],
    "contentTitle": "Updated UPSC Civil Services Examination 2024",
    "contentDescription": "Updated complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
    "colorCode": "#FF8C42",
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
    "updatedAt": "2024-01-15T12:30:00.000Z"
  }
}
```

### 5. Delete Top Data
**DELETE** `/admin/topdata/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Top data deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid ID format"
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
  "message": "Top data not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

## Testing Examples

### 1. Create Top Data
```bash
curl -X POST http://localhost:3000/admin/topdata \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metaTitle": "UPSC Civil Services 2024",
    "metaDescription": "Complete guide for UPSC Civil Services Examination 2024",
    "keywords": ["UPSC", "Civil Services", "Government Jobs", "2024"],
    "tags": ["UPSC", "Civil Services", "Exam"],
    "contentTitle": "UPSC Civil Services Examination 2024",
    "contentDescription": "Complete information about UPSC Civil Services Examination 2024 including syllabus, exam pattern, and preparation tips.",
    "colorCode": "#FF6B35"
  }'
```

### 2. Get All Top Data
```bash
curl -X GET http://localhost:3000/admin/topdata \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Get Single Top Data
```bash
curl -X GET http://localhost:3000/admin/topdata/TOP_DATA_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Update Top Data
```bash
curl -X PUT http://localhost:3000/admin/topdata/TOP_DATA_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metaTitle": "Updated UPSC Civil Services 2024",
    "contentTitle": "Updated UPSC Civil Services Examination 2024",
    "colorCode": "#FF8C42"
  }'
```

### 5. Delete Top Data
```bash
curl -X DELETE http://localhost:3000/admin/topdata/TOP_DATA_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Features

### Role-Based Access
- **Admin**: Full CRUD operations (Create, Read, Update, Delete)
- All operations require admin authentication

### Data Validation
- Required fields validation (metaTitle, contentTitle)
- ObjectId format validation
- Color code validation (hex format)

### Security Features
- JWT authentication for all routes
- Admin role verification
- Input sanitization
- Error handling

### Content Management
- Active/inactive status control
- Audit trail (created by, updated by)
- Timestamp tracking
- Meta information management
- SEO-friendly structure
- Color coding support

### Data Structure
- **Meta Information**: Title, description, keywords, tags for SEO
- **Content**: Title and description for display
- **Styling**: Color code for visual customization
- **Status**: Active/inactive control
- **Audit**: Creation and update tracking

### Color Code Support
- Default color: #000000 (black)
- Supports any valid hex color code
- Used for visual customization of content

### SEO Optimization
- Meta title and description for search engines
- Keywords array for better indexing
- Tags for categorization
- Structured data format

### Soft Delete
- Records are marked as inactive rather than physically deleted
- Maintains data integrity and audit trail
- Allows for potential recovery if needed 