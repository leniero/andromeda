const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Auth API', () => {
  let token;

  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});