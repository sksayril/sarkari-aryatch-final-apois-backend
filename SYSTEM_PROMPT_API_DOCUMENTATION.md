# System Prompt API Documentation

## Overview
The System Prompt API provides functionality to manage AI bot system prompts. This API supports role-based access with admin-only management and enforces a single system prompt constraint - only one active system prompt can exist at a time. This ensures consistent AI bot behavior across the application.

## Base URL
```
http://localhost:3000/admin/system-prompt
```

## Authentication
- All routes require JWT token in Authorization header: `Bearer <admin_token>`
- Admin role required for all operations

## Data Model
```javascript
{
  systemPrompt: String (required),
  description: String,
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  updatedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Important Constraint
- **Only one active system prompt allowed**: The system enforces that only one system prompt can be active at a time
- When creating a new system prompt, if one already exists, the API will return an error
- To change the system prompt, use the update endpoint instead of creating a new one

## API Endpoints

### 1. Create System Prompt
**POST** `/admin/system-prompt`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses.",
  "description": "AI Bot system prompt for government job portal assistance"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "System prompt created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses.",
    "description": "AI Bot system prompt for government job portal assistance",
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
}
```

**Error Response (400) - When system prompt already exists:**
```json
{
  "success": false,
  "message": "System prompt already exists. Only one system prompt is allowed. Please update the existing one instead."
}
```

### 2. Get System Prompt
**GET** `/admin/system-prompt`

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
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses.",
    "description": "AI Bot system prompt for government job portal assistance",
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

**Error Response (404) - When no system prompt exists:**
```json
{
  "success": false,
  "message": "No system prompt found"
}
```

### 3. Get System Prompt by ID
**GET** `/admin/system-prompt/:id`

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
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses.",
    "description": "AI Bot system prompt for government job portal assistance",
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

### 4. Update System Prompt
**PUT** `/admin/system-prompt/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses. You can also help with exam preparation tips and career advice.",
  "description": "Updated AI Bot system prompt for government job portal assistance with enhanced capabilities",
  "isActive": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "System prompt updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses. You can also help with exam preparation tips and career advice.",
    "description": "Updated AI Bot system prompt for government job portal assistance with enhanced capabilities",
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

### 5. Delete System Prompt
**DELETE** `/admin/system-prompt/:id`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "System prompt deleted successfully"
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

### 400 Bad Request - System Prompt Already Exists
```json
{
  "success": false,
  "message": "System prompt already exists. Only one system prompt is allowed. Please update the existing one instead."
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
  "message": "System prompt not found"
}
```

### 404 Not Found - No System Prompt
```json
{
  "success": false,
  "message": "No system prompt found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Testing Examples

### 1. Create System Prompt
```bash
curl -X POST http://localhost:3000/admin/system-prompt \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses.",
    "description": "AI Bot system prompt for government job portal assistance"
  }'
```

### 2. Get System Prompt
```bash
curl -X GET http://localhost:3000/admin/system-prompt \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Get System Prompt by ID
```bash
curl -X GET http://localhost:3000/admin/system-prompt/SYSTEM_PROMPT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Update System Prompt
```bash
curl -X PUT http://localhost:3000/admin/system-prompt/SYSTEM_PROMPT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "systemPrompt": "You are an AI assistant for a government job portal. You help users find information about government jobs, exam notifications, results, and career guidance. Always provide accurate, helpful, and up-to-date information. Be polite, professional, and concise in your responses. You can also help with exam preparation tips and career advice.",
    "description": "Updated AI Bot system prompt for government job portal assistance with enhanced capabilities"
  }'
```

### 5. Delete System Prompt
```bash
curl -X DELETE http://localhost:3000/admin/system-prompt/SYSTEM_PROMPT_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## Features

### Single System Prompt Constraint
- **Only one active system prompt allowed**: The system enforces that only one system prompt can be active at a time
- **Prevents conflicts**: Ensures consistent AI bot behavior across the application
- **Update instead of create**: When a system prompt already exists, the API suggests updating instead of creating a new one

### Role-Based Access
- **Admin**: Full CRUD operations (Create, Read, Update, Delete)
- All operations require admin authentication

### Data Validation
- Required fields validation (systemPrompt)
- ObjectId format validation
- System prompt uniqueness validation

### Security Features
- JWT authentication for all routes
- Admin role verification
- Input sanitization
- Error handling

### Content Management
- Active/inactive status control
- Audit trail (created by, updated by)
- Timestamp tracking
- Description field for documentation

### Data Structure
- **System Prompt**: The main AI bot system prompt text
- **Description**: Optional description for documentation
- **Status**: Active/inactive control
- **Audit**: Creation and update tracking

### Soft Delete
- Records are marked as inactive rather than physically deleted
- Maintains data integrity and audit trail
- Allows for potential recovery if needed

### Use Cases

#### 1. Initial Setup
- Create the first system prompt for the AI bot
- Set the tone, behavior, and capabilities of the AI assistant

#### 2. System Prompt Updates
- Update the system prompt to improve AI behavior
- Add new capabilities or modify existing ones
- Change the tone or style of responses

#### 3. System Prompt Management
- View current system prompt configuration
- Deactivate system prompt if needed
- Track who made changes and when

#### 4. AI Bot Integration
- Retrieve the active system prompt for AI bot initialization
- Ensure consistent behavior across all AI interactions
- Maintain single source of truth for AI configuration

## Best Practices

### 1. System Prompt Design
- Keep prompts clear and specific
- Include role definition and behavior guidelines
- Specify response format and tone
- Include error handling instructions

### 2. Update Strategy
- Test system prompt changes in development first
- Update during low-traffic periods
- Monitor AI bot performance after updates
- Keep backup of previous system prompts

### 3. Security Considerations
- Only admin users can modify system prompts
- Validate input to prevent injection attacks
- Log all system prompt changes for audit
- Implement proper error handling

### 4. Integration Guidelines
- Always fetch the active system prompt before AI interactions
- Handle cases where no system prompt exists
- Implement fallback behavior if system prompt is unavailable
- Cache system prompt for performance (with invalidation on updates) 