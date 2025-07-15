# Basic API Building - Admin and User Management System

A comprehensive Node.js API system with role-based authentication, employee management, and category/subcategory functionality.

## Features

- **Role-based Authentication**: Admin, Employee, and User roles
- **Employee Management**: Admins can create and manage employees
- **Category Management**: Main categories and subcategories with markdown support
- **Public APIs**: Users can access category data without authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Secure password storage using bcrypt

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. **Create Admin User**
   ```bash
   node scripts/createAdmin.js
   ```
   Default admin credentials:
   - Email: admin@example.com
   - Password: admin123

4. **Start the Server**
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints

#### User Authentication (Public)
- `POST /users/signup` - User registration
- `POST /users/login` - User login

#### Admin Authentication
- `POST /admin/login` - Admin login

#### Employee Authentication
- `POST /employee/login` - Employee login

### Admin APIs (Require Admin Authentication)

#### Employee Management
- `POST /admin/employees` - Create new employee
- `GET /admin/employees` - Get all employees

#### Category Management
- `POST /admin/categories/main` - Create main category
- `GET /admin/categories/main` - Get all main categories
- `POST /admin/categories/sub` - Create sub category
- `GET /admin/categories/sub` - Get all sub categories

### Employee APIs (Require Employee Authentication)

#### Subcategory Management
- `GET /employee/subcategories` - Get all sub categories
- `GET /employee/subcategories/:id` - Get sub category by ID
- `PUT /employee/subcategories/:id` - Update sub category

### Public APIs (No Authentication Required)

#### Category Access
- `GET /category/main` - Get all main categories
- `GET /category/main/:id` - Get main category by ID
- `GET /category/sub` - Get all sub categories
- `GET /category/sub/:id` - Get sub category by ID
- `GET /category/sub/main/:mainCategoryId` - Get sub categories by main category
- `GET /category/sub/search/:query` - Search sub categories

## Request/Response Examples

### User Signup
```json
POST /users/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Admin Login
```json
POST /admin/login
{
  "email": "admin@example.com",
  "password": "admin123"
}

Response:
{
  "message": "Admin login successful",
  "token": "jwt_token_here",
  "admin": {
    "id": "admin_id",
    "name": "Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Create Employee (Admin)
```json
POST /admin/employees
Headers: Authorization: Bearer jwt_token_here
{
  "name": "Employee Name",
  "email": "employee@example.com",
  "userId": "emp001",
  "password": "emp123"
}

Response:
{
  "message": "Employee created successfully",
  "employee": {
    "id": "employee_id",
    "name": "Employee Name",
    "email": "employee@example.com",
    "userId": "emp001"
  }
}
```

### Create Main Category (Admin)
```json
POST /admin/categories/main
Headers: Authorization: Bearer jwt_token_here
{
  "title": "Technology"
}

Response:
{
  "message": "Main category created successfully",
  "category": {
    "id": "category_id",
    "title": "Technology"
  }
}
```

### Create Sub Category (Admin)
```json
POST /admin/categories/sub
Headers: Authorization: Bearer jwt_token_here
{
  "mainCategory": "main_category_id",
  "metaTitle": "Web Development",
  "metaDescription": "Learn web development",
  "keywords": ["web", "development", "programming"],
  "tags": ["tech", "coding"],
  "contentTitle": "Web Development Guide",
  "contentDescription": "# Web Development\n\nThis is a markdown guide..."
}

Response:
{
  "message": "Sub category created successfully",
  "subCategory": {
    "id": "sub_category_id",
    "metaTitle": "Web Development",
    "contentTitle": "Web Development Guide"
  }
}
```

### Update Sub Category (Employee)
```json
PUT /employee/subcategories/:id
Headers: Authorization: Bearer jwt_token_here
{
  "metaTitle": "Updated Web Development",
  "contentDescription": "# Updated Guide\n\nUpdated markdown content..."
}

Response:
{
  "message": "Sub category updated successfully",
  "subCategory": {
    "id": "sub_category_id",
    "metaTitle": "Updated Web Development",
    "contentTitle": "Web Development Guide",
    "updatedBy": "employee_id"
  }
}
```

### Get Categories (Public)
```json
GET /category/main

Response:
{
  "categories": [
    {
      "_id": "category_id",
      "title": "Technology"
    }
  ]
}
```

```json
GET /category/sub

Response:
{
  "subCategories": [
    {
      "_id": "sub_category_id",
      "metaTitle": "Web Development",
      "metaDescription": "Learn web development",
      "keywords": ["web", "development"],
      "tags": ["tech", "coding"],
      "contentTitle": "Web Development Guide",
      "contentDescription": "# Web Development\n\nMarkdown content...",
      "mainCategory": {
        "_id": "main_category_id",
        "title": "Technology"
      }
    }
  ]
}
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

## Data Models

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed)
- role (String, enum: ['admin', 'user'], default: 'user')
- isActive (Boolean, default: true)
- timestamps

### Employee Model
- name (String, required)
- email (String, required, unique)
- userId (String, required, unique)
- password (String, required, hashed)
- createdBy (ObjectId, ref: User, required)
- isActive (Boolean, default: true)
- timestamps

### MainCategory Model
- title (String, required, unique)
- createdBy (ObjectId, ref: User, required)
- isActive (Boolean, default: true)
- timestamps

### SubCategory Model
- mainCategory (ObjectId, ref: MainCategory, required)
- metaTitle (String, required)
- metaDescription (String)
- keywords (Array of Strings)
- tags (Array of Strings)
- contentTitle (String, required)
- contentDescription (String) - supports markdown
- createdBy (ObjectId, ref: User, required)
- updatedBy (ObjectId, ref: Employee)
- isActive (Boolean, default: true)
- timestamps

## Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation
- Error handling
- CORS enabled

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

All error responses include a message field with details about the error.
