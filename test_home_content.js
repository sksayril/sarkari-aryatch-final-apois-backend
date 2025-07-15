const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testHomeContent = {
  title: "Welcome to Our Platform",
  description: "Your trusted source for information and services",
  telegramLink: "https://t.me/yourchannel",
  whatsappLink: "https://wa.me/1234567890",
  faqs: [
    {
      question: "How do I get started?",
      answer: "Simply sign up and explore our services."
    },
    {
      question: "What services do you offer?",
      answer: "We offer a wide range of information and support services."
    }
  ]
};

async function testHomeContentAPI() {
  try {
    console.log('Testing Home Content API...\n');

    // 1. Test public endpoint (should work without token)
    console.log('1. Testing public endpoint...');
    try {
      const publicResponse = await axios.get(`${BASE_URL}/home-content/public/active`);
      console.log('✅ Public endpoint works:', publicResponse.status);
    } catch (error) {
      console.log('⚠️ Public endpoint error (expected if no data):', error.response?.status || error.message);
    }

    // 2. Test admin endpoint without token (should fail)
    console.log('\n2. Testing admin endpoint without token...');
    try {
      await axios.post(`${BASE_URL}/home-content/admin/create`, testHomeContent);
      console.log('❌ Should have failed without token');
    } catch (error) {
      console.log('✅ Correctly rejected without token:', error.response?.status);
    }

    console.log('\n✅ Basic API structure test completed!');
    console.log('\nTo test with admin token:');
    console.log('1. First create an admin account: POST /admin/signup');
    console.log('2. Login as admin: POST /admin/login');
    console.log('3. Use the token to test admin endpoints');

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testHomeContentAPI(); 