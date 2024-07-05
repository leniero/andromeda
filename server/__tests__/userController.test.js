const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('User API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password'
      });
    token = res.body.token;
  });

  it('should fetch current user data', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should change user password', async () => {
    const res = await request(app)
      .put('/api/users/change_password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'password',
        newPassword: 'new_password'
      });
    expect(res.statusCode).toEqual(200);
  });
});