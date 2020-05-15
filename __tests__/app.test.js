import request from 'supertest';
import app from '../src/app';
// import database from '../src/models/index';


describe('app module', () => {
  test('it exists', async () => {
    expect(app).toBeDefined();
  });

  test('It adds two numbers', () => {
    expect(1 + 1).toBe(2);
  });

  it('It should respond the GET method', async () => {
    const response = await request(app).get('/');
    const { statusCode } = response;
    expect(statusCode).toBe(200);
  });
});

/**
   * Test for 404
   */
describe('GET/POST for unavailable routes', () => {
  it('it should return 404 for unavailable routes', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
    expect(response).toHaveProperty('error');
  });
});
