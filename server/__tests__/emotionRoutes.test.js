// __tests__/emotionRoutes.test.js
const request = require('supertest');
const express = require('express');
const emotionRoutes = require('../routes/emotionRoutes');
const Emotion = require('../models/emotionModel'); // Assuming you have an emotion model

const app = express();
app.use(express.json());
app.use('/emotions', emotionRoutes);

jest.mock('../models/emotionModel');

describe('Emotion Routes', () => {
  test('POST /emotions/record_emotion - success', async () => {
    const mockEmotion = {
      _id: '1',
      userId: '1',
      emotion: 'Joy',
      text_input: 'Feeling great!',
      local_time: new Date(),
    };

    Emotion.create.mockResolvedValue(mockEmotion);

    const response = await request(app)
      .post('/emotions/record_emotion')
      .send(mockEmotion);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
  });

  test('POST /emotions/record_emotion - failure', async () => {
    Emotion.create.mockRejectedValue(new Error('Record emotion error'));

    const response = await request(app)
      .post('/emotions/record_emotion')
      .send({ userId: '1', emotion: 'Joy', text_input: 'Feeling great!', local_time: new Date() });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Record emotion error');
  });

  test('GET /emotions/get_emotions - success', async () => {
    const mockEmotions = [
      { _id: '1', userId: '1', emotion: 'Joy', text_input: 'Feeling great!', local_time: new Date() },
    ];

    Emotion.find.mockResolvedValue(mockEmotions);

    const response = await request(app)
      .get('/emotions/get_emotions')
      .query({ userId: '1' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  test('GET /emotions/get_emotions - failure', async () => {
    Emotion.find.mockRejectedValue(new Error('Get emotions error'));

    const response = await request(app)
      .get('/emotions/get_emotions')
      .query({ userId: '1' });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Get emotions error');
  });
});