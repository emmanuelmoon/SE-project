const supertest = require('supertest');
const app = require('../index');// Adjust the path according to your structure
const mongoose = require('mongoose');
const userModel = require('../models/userModel'); // Ensure this path is correct

// Setup a test database connection
beforeAll(async () => {
});

// Clean up and close DB connection
afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /users', () => {
  let token;

  // Perform login to get a token
  beforeAll(async () => {
    const loginResponse = await supertest(app)
      .post('/api/user/login') // Adjust this endpoint as per your API
      .send({
        email: 'admin@example.com', // Replace with actual username
        password: 'password123'  // Replace with actual password
      });

    token = loginResponse.body.token; // Adjust this if the token is stored differently in the response
  });

  test('should return all users successfully', async () => {
    // const response = await supertest(app)
    //   .post('/api/user/register') // Adjust if your endpoint differs
    //   .send({
    //     name: 'Test User',
    //     email: 'test@example.com',
    //     password: 'password123'
    //   })
    //   .expect(201)
    //   .expect('Content-Type', /json/);
    const response = await supertest(app)
      .get('/api/admin/getAllUsers')
      .set('Authorization', `Bearer ${token}`);

    console.log(response.body);
    expect(response.status).toBe(200);
  });
});