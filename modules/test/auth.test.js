// test/user.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const connectDB = require('../config/db');


describe('User API', () => { 
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await new Promise(resolve => setTimeout(() => resolve(), 500));
  },);

  describe('POST /Doctor', () => {
    it('should create a new doctor', async () => {
      const response = await request(app)
        .post('/api/Doctor/')
        .send({
          FullName: 'UserDoctor',
          DateNaissance: '25/02/2002',
          email: 'test@example.com',
          USERName: 'testuser',
          password: 'password123',
          NameCabinet: 'CabinetDoctor1',
          AddressCabinet:'adresse1',
          Speciality: 'Cardiolo'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', 'testuser');
      expect(response.body).toHaveProperty('email', 'test@example.com');

    });

    it('should return 400 if data is invalid', async () => {
      const response = await request(app)
        .post('/api/Doctor/')
        .send({
          username: '',
          email: 'invalidemail',
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
  describe('POST /Patient', () => {
    it('should create a new Patient', async () => {
      const response = await request(app)
        .post('/api/Patient/')
        .send({
          FullName: 'UserPatient',
          DateNaissance: '25/02/2002',
          email: 'test@example.com',
          userName: 'testPatientuser',
          password: 'password123patient',
          TypeDeMaladie: 'coeur'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('username', 'UserPatient');
      expect(response.body).toHaveProperty('email', 'test@example.com');

    });

    it('should return 400 if data is invalid', async () => {
      const response = await request(app)
        .post('/api/Patient/')
        .send({
          username: '',
          email: 'invalidemail',
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

/*  describe('GET /users', () => {
    it('should get all users', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test2@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();

      const response = await request(app).get('/api/users/');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /users/:id', () => {
    it('should get a user by id', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test3@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();

      const response = await request(app).get(`/api/users/${user._id}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'testuser');
    },10000);
    
    it('should return 404 if user not found', async () => {
      const userId = new mongoose.Types.ObjectId();
      const response = await request(app).get(`/api/users/${userId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    },10000);

    it('should return 404 for invalid user ID format', async () => {
      const response = await request(app).get('/api/users/invalidid');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Invalid user ID format');
    },10000);
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test5@example.com',
        password: 'password123',
        role: 'user'
      });
      await user.save();
      console.log(user);
      console.log(user._id);
      const response = await request(app)
        .put(`/api/users/${user._id}`)
        .send({
          username: 'updateduser',
          email: 'updated@example.com',
          password: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username', 'updateduser');
    },10000);
    it('should return 404 if user not found', async () => {
      const userID= new mongoose.Types.ObjectId(); 
      const response = await request(app)
        .put(`/api/users/${userID}`)
        .send({ username: 'updateduser' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    },10000);

    it('should return 404 for invalid user ID format', async () => {
      const response = await request(app)
        .put('/api/users/invalidid')
        .send({ username: 'updateduser' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Invalid user ID format');
    },10000);
    
  });
*/

});
