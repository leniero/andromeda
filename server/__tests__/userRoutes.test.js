const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('../routes/userRoutes');
const User = require('../models/userModel');

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

jest.mock('../models/userModel');

let server;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  server = app.listen(5001);
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

describe('User Routes', () => {
  test('GET /user/me - success', async () => {
    const mockUser = {
      _id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };

    User.findById.mockResolvedValue(mockUser);

    const response = await request(app)
      .get('/user/me')
      .set('Authorization', 'Bearer token');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

  // Additional tests here
});