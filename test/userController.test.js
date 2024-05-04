const supertest = require('supertest');
const app = require('../index');// Adjust the path according to your structure
const mongoose = require('mongoose');
const userModel = require('../models/userModel'); // Ensure this path is correct

// Setup a test database connection
beforeAll(async () => {
});

// Clean up and close DB connection
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /register', () => {
  test('It should respond with 201 status code and success message', async () => {
    const response = await supertest(app)
      .post('/api/user/register') // Adjust if your endpoint differs
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body.success).toBe(true);
    expect(response.body.newUser).toHaveProperty('email', 'test@example.com');
  });

  test('It should handle errors and respond with 400 status code', async () => {
    const response = await supertest(app)
      .post('/api/user/register')
      .send({
        name: 'Test User',
        email: 'test@example.com', // Sending the same email to trigger a unique constraint error
        password: 'password123'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(response.body.success).toBe(false);
    expect(response.body).toHaveProperty('error');
  });

  describe('Login Controller', () => {
    test('User Not Found', async () => {
      const response = await supertest(app)
        .post('/api/user/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.text).toBe('User Not Found');
    });
  });

  describe('Login Controller', () => {
    test('Valid User Login', async () => {
      const response = await supertest(app)
        .post('/api/user/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "Login Success",
        success: true,
        token: expect.any(String)  // Check if token is returned
      });
    });
  });
});