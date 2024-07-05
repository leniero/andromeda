const request = require('supertest');
const app = require('../server'); // Adjust the path as needed

describe('Emotion API', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
      });
    token = res.body.token;
  });

  it('should record an emotion', async () => {
    const res = await request(app)
      .post('/api/emotions/record_emotion')
      .set('Authorization', `Bearer ${token}`)
      .send({
        emotion: 'Joy',
        text_input: 'Feeling great!',
        latitude: 40.7128,
        longitude: -74.0060,
        local_time: new Date().toISOString(),
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });

  it('should fetch emotions', async () => {
    const res = await request(app)
      .get('/api/emotions/get_emotions')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});