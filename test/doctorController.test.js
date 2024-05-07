const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from this file
const { appointmentModel, userModel } = require('../models'); // Adjust path as necessary

beforeAll(async () => {

});

afterAll(async () => {
  // Disconnect after tests run
  await mongoose.disconnect();
});

describe('updateStatusController', () => {
  it('should update the appointment status and notify the user', async () => {
    // Assuming there's an appointment and user already in the database
    const appointment = await appointmentModel.create({
      userId: 'someUserId',
      status: 'pending'
    });
    const user = await userModel.create({
      _id: 'someUserId',
      notification: []
    });

    const response = await request(app)
      .post("/api/doctor/update-status") // Adjust this path to match your actual route
      .send({
        appointmentsId: appointment._id,
        status: 'completed'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toBe('Appointment Status Updated');

    // Verify the database was updated
    const updatedAppointment = await appointmentModel.findById(appointment._id);
    expect(updatedAppointment.status).toBe('completed');

    const updatedUser = await userModel.findById(user._id);
    expect(updatedUser.notification.length).toBeGreaterThan(0);
    expect(updatedUser.notification[0].message).toContain('completed');
  });
});
