const supertest = require('supertest');
const app = require('../index');// Adjust the path according to your structure
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel'); // Ensure this path is correct
// Ensure this path is correct

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
    const response = await supertest(app)
      .get('/api/admin/getAllUsers')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  }, 30000);
});


// describe('changeAccountStatusController Tests', function () {
//   let doctorId;
//   beforeEach(async function () {
//     await userModel.create({
//       name: 'John Doe',
//       email: 'john.doe@example.com',
//       password: 'password123@2!#'
//     });

//     await doctorModel.create({
//       name: 'Dr. Smith',
//       specialty: 'Cardiology',
//       status: 'pending'
//     });
//     doctorId = doctor._id.toString();
//   });

//   afterEach(async function () {
//     await userModel.deleteOne({ email: 'john.doe@example.com' });
//     await doctorModel.deleteOne({ name: 'Dr. Smith' });
//   });

//   test('should update the doctor status and user notification', async function () {
//     const res = await request(app)
//       .post("/api/admin/changeAccountStatus") // Adjust according to actual route
//       .send({ doctorId: doctorId, status: 'approved' });

//     expect(res.status).to.equal(201);
//     expect(res.body.success).to.be.true;
//     expect(res.body.message).to.equal('Account Status Updated');

//     // Additional database checks can be performed here
//   }, 30000);

//   // Additional test cases
// })