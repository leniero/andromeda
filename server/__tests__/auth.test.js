// __tests__/auth.test.js

const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

const { app, connectDB, startServer } = require('../initServer');
const User = require('../models/User');

let server;

beforeAll(async () => {
  await connectDB();
  server = startServer(5001);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  it('should signup a user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        role: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
        role: 'user'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});