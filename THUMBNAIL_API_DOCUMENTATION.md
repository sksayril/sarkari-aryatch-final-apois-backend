# Thumbnail API Documentation

## Overview
The Thumbnail API provides endpoints for managing thumbnail images with optional URLs. Admins can upload, manage, and organize thumbnails, while public users can retrieve thumbnail information.

## Base URL
```
/thumbnails
```

## Features
- ✅ Image upload with server storage
- ✅ Optional URL linking
- ✅ Admin-only management
- ✅ Public access for thumbnails
- ✅ Search functionality
- ✅ Soft delete (isActive flag)
- ✅ File validation (images only, 5MB limit)
- ✅ Automatic file cleanup on deletion

---

## 🔐 ADMIN ROUTES (Authentication Required)

### 1. Create Thumbnail
**POST** `/thumbnails/admin`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `image` (required): Image file (JPG, PNG, GIF, etc.)
- `title` (required): Thumbnail title
- `description` (optional): Thumbnail description
- `url` (optional): Associated URL

**Example Request:**
```bash
curl -X POST \
  http://localhost:3000/thumbnails/admin \
  -H 'Authorization: Bearer <admin_token>' \
  -F 'image=@/path/to/image.jpg' \
  -F 'title=My Thumbnail' \
  -F 'description=This is a sample thumbnail' \
  -F 'url=https://example.com'
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Thumbnail created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My Thumbnail",
    "description": "This is a sample thumbnail",
    "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
    "originalFileName": "image.jpg",
    "fileSize": 245760,
    "mimeType": "image/jpeg",
    "url": "https://example.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2023-10-30T10:30:00.000Z",
    "updatedAt": "2023-10-30T10:30:00.000Z"
  }
}
```

### 2. Get All Thumbnails (Admin)
**GET** `/thumbnails/admin`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My Thumbnail",
      "description": "This is a sample thumbnail",
      "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
      "originalFileName": "image.jpg",
      "fileSize": 245760,
      "mimeType": "image/jpeg",
      "url": "https://example.com",
      "isActive": true,
      "createdBy": {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "updatedBy": null,
      "createdAt": "2023-10-30T10:30:00.000Z",
      "updatedAt": "2023-10-30T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Single Thumbnail (Admin)
**GET** `/thumbnails/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My Thumbnail",
    "description": "This is a sample thumbnail",
    "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
    "originalFileName": "image.jpg",
    "fileSize": 245760,
    "mimeType": "image/jpeg",
    "url": "https://example.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "updatedBy": null,
    "createdAt": "2023-10-30T10:30:00.000Z",
    "updatedAt": "2023-10-30T10:30:00.000Z"
  }
}
```

### 4. Update Thumbnail
**PUT** `/thumbnails/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `image` (optional): New image file
- `title` (optional): Updated title
- `description` (optional): Updated description
- `url` (optional): Updated URL
- `isActive` (optional): Boolean flag

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thumbnail updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "Updated Thumbnail",
    "description": "Updated description",
    "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
    "originalFileName": "image.jpg",
    "fileSize": 245760,
    "mimeType": "image/jpeg",
    "url": "https://updated-example.com",
    "isActive": true,
    "createdBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "updatedBy": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2023-10-30T10:30:00.000Z",
    "updatedAt": "2023-10-30T11:00:00.000Z"
  }
}
```

### 5. Delete Thumbnail
**DELETE** `/thumbnails/admin/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Thumbnail deleted successfully"
}
```

---

## 🌐 PUBLIC ROUTES (No Authentication Required)

### 1. Get All Thumbnails
**GET** `/thumbnails`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My Thumbnail",
      "description": "This is a sample thumbnail",
      "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
      "url": "https://example.com",
      "createdAt": "2023-10-30T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Single Thumbnail
**GET** `/thumbnails/:id`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "title": "My Thumbnail",
    "description": "This is a sample thumbnail",
    "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
    "url": "https://example.com",
    "createdAt": "2023-10-30T10:30:00.000Z"
  }
}
```

### 3. Search Thumbnails
**GET** `/thumbnails/search/:query`

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "My Thumbnail",
      "description": "This is a sample thumbnail",
      "imageUrl": "/uploads/thumbnails/thumbnail-1698765432123-123456789.jpg",
      "url": "https://example.com",
      "createdAt": "2023-10-30T10:30:00.000Z"
    }
  ]
}
```

---

## 📁 File Storage

### Storage Location
Thumbnails are stored in: `public/uploads/thumbnails/`

### File Naming Convention
```
thumbnail-{timestamp}-{random}.{extension}
Example: thumbnail-1698765432123-123456789.jpg
```

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- SVG (.svg)

### File Size Limit
- Maximum: 5MB per file

---

## 🔒 Security Features

### File Validation
- Only image files are accepted
- File size validation (5MB limit)
- MIME type validation

### Access Control
- Admin routes require authentication and admin role
- Public routes are open but only return active thumbnails
- Soft delete prevents data loss

### File Management
- Automatic directory creation
- Unique filename generation
- Old file cleanup on update/delete

---

## 📊 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Image file is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Thumbnail not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

---

## 🚀 Usage Examples

### Frontend Integration (JavaScript)
```javascript
// Upload thumbnail
const formData = new FormData();
formData.append('image', fileInput.files[0]);
formData.append('title', 'My Thumbnail');
formData.append('description', 'Description here');
formData.append('url', 'https://example.com');

fetch('/thumbnails/admin', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${adminToken}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));

// Get public thumbnails
fetch('/thumbnails')
.then(response => response.json())
.then(data => {
  data.data.forEach(thumbnail => {
    console.log(`Title: ${thumbnail.title}`);
    console.log(`Image: ${thumbnail.imageUrl}`);
    console.log(`URL: ${thumbnail.url}`);
  });
});
```

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';

const ThumbnailGallery = () => {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    fetch('/thumbnails')
      .then(res => res.json())
      .then(data => setThumbnails(data.data));
  }, []);

  return (
    <div className="thumbnail-gallery">
      {thumbnails.map(thumbnail => (
        <div key={thumbnail._id} className="thumbnail-item">
          <img src={thumbnail.imageUrl} alt={thumbnail.title} />
          <h3>{thumbnail.title}</h3>
          <p>{thumbnail.description}</p>
          {thumbnail.url && (
            <a href={thumbnail.url} target="_blank" rel="noopener noreferrer">
              Visit Link
            </a>
          )}
        </div>
      ))}
    </div>
  );
};
```

---

## 📝 Notes

1. **Image URLs**: Images are served from the `/uploads/thumbnails/` path
2. **Sorting**: All lists are sorted by creation date (newest first)
3. **Soft Delete**: Deleted thumbnails are marked as inactive, not physically removed
4. **File Cleanup**: Old files are automatically deleted when thumbnails are updated or deleted
5. **Search**: Public search searches both title and description fields
6. **Pagination**: Currently not implemented, but can be added if needed 