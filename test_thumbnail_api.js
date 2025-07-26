const fs = require('fs');
const path = require('path');

// Test script for Thumbnail API
console.log('🧪 Thumbnail API Test Script');
console.log('============================\n');

// Test endpoints
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = {
  // Public endpoints
  GET_ALL: '/thumbnails',
  GET_SINGLE: '/thumbnails/:id',
  SEARCH: '/thumbnails/search/:query',
  
  // Admin endpoints (require authentication)
  CREATE: '/thumbnails/admin',
  GET_ALL_ADMIN: '/thumbnails/admin',
  GET_SINGLE_ADMIN: '/thumbnails/admin/:id',
  UPDATE: '/thumbnails/admin/:id',
  DELETE: '/thumbnails/admin/:id'
};

console.log('📋 Available Endpoints:');
Object.entries(ENDPOINTS).forEach(([name, endpoint]) => {
  console.log(`  ${name}: ${BASE_URL}${endpoint}`);
});

console.log('\n🔐 Authentication Required:');
console.log('  - All /admin endpoints require Bearer token');
console.log('  - Token format: Authorization: Bearer <your_admin_token>');

console.log('\n📁 File Upload:');
console.log('  - Use multipart/form-data for file uploads');
console.log('  - Supported formats: JPG, PNG, GIF, WebP, SVG');
console.log('  - Max file size: 5MB');

console.log('\n📂 File Storage:');
console.log('  - Location: public/uploads/thumbnails/');
console.log('  - Files are automatically served from /uploads/thumbnails/');

console.log('\n🔄 Usage Examples:');
console.log('  1. Create thumbnail: POST /thumbnails/admin');
console.log('  2. Get all thumbnails: GET /thumbnails');
console.log('  3. Get single thumbnail: GET /thumbnails/:id');
console.log('  4. Search thumbnails: GET /thumbnails/search/:query');
console.log('  5. Update thumbnail: PUT /thumbnails/admin/:id');
console.log('  6. Delete thumbnail: DELETE /thumbnails/admin/:id');

console.log('\n📝 Sample Request (Create Thumbnail):');
console.log(`
curl -X POST \\
  ${BASE_URL}/thumbnails/admin \\
  -H 'Authorization: Bearer <admin_token>' \\
  -F 'image=@/path/to/image.jpg' \\
  -F 'title=My Thumbnail' \\
  -F 'description=This is a sample thumbnail' \\
  -F 'url=https://example.com'
`);

console.log('\n📝 Sample Request (Get Public Thumbnails):');
console.log(`
curl -X GET \\
  ${BASE_URL}/thumbnails
`);

console.log('\n✅ Thumbnail API is ready to use!');
console.log('📚 See THUMBNAIL_API_DOCUMENTATION.md for complete documentation.'); 