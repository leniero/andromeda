const axios = require('axios');
async function run() {
  try {
    const signupRes = await axios.post('http://localhost:5001/api/auth/signup', {
      username: 'testuser123',
      email: 'testuser123@example.com',
      password: 'password123'
    });
    const token = signupRes.data.token;
    console.log('Got token:', token);
    
    const meRes = await axios.get('http://localhost:5001/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Me response:', meRes.data);
  } catch (err) {
    if (err.response) {
      console.error('Error Response:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}
run();
