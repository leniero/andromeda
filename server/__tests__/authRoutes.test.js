// __tests__/authRoutes.test.js
const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/userModel'); // Assuming you have a user model

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

jest.mock('../models/userModel');

describe('Auth Routes', () => {
  test('POST /auth/signup - success', async () => {
    const mockUser = {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
    };

    User.create.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/signup - failure', async () => {
    User.create.mockRejectedValue(new Error('Signup error'));

    const response = await request(app)
      .post('/auth/signup')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Signup error');
  });

  test('POST /auth/login - success', async () => {
    const mockUser = {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    User.findOne.mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /auth/login - failure', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });
});