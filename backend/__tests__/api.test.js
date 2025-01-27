const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Your Express app
const User = require('../models/user');
const Recipe = require('../models/recipe');

describe('API Integration Tests', () => {
  let authToken;
  let testUserId;
  const TEST_FLAG = 'TEST_ENTRY_FOR_API_TESTING';

  const generateToken = (userId) => {
    return jwt.sign({ id: userId }, 'your_jwt_secret');
  };

  beforeAll(async () => {
    await mongoose.connect('mongodb+srv://bunnytina:Luminara78@cooking-app.y3xtb.mongodb.net/Cooking?retryWrites=true&w=majority&appName=cooking-app');
    
    const testUser = new User({
      email: `test.${Date.now()}@test.com`,
      password: 'password123',
      name: 'Test User',
      testFlag: TEST_FLAG
    });
    
    const savedUser = await testUser.save();
    testUserId = savedUser._id;
    authToken = generateToken(testUserId);
    console.log('Generated auth token:', authToken);
  });

  afterAll(async () => {
    // Clean up only test entries
    await User.deleteMany({ testFlag: TEST_FLAG });
    await Recipe.deleteMany({ testFlag: TEST_FLAG });
    await mongoose.connection.close();
  });

  describe('Recipe Creation', () => {
    test('successfully creates a recipe with valid data', async () => {
      const recipeData = {
        title: `Test Recipe ${Date.now()}`,
        description: 'A test recipe',
        image: 'https://res.cloudinary.com/dlyz3eqds/image/upload/v1737914907/cbyzjjactlwvz8vfm1ou.webp',
        ingredients: [{ name: 'Test Ingredient', amount: '100', unit: 'g' }],
        steps: [{ description: 'Test step' }],
        cookingTime: 30,
        servings: 4,
        cuisine: 'Italian',
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false
        },
        testFlag: TEST_FLAG
      };

      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(recipeData);

      if (response.status !== 201) {
        console.error('Recipe creation failed:', response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(recipeData.title);
      expect(response.body.author).toBe(testUserId.toString());
    });

    test('fails to create recipe without authentication', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .send({
          title: 'Test Recipe',
          description: 'A test recipe',
          testFlag: TEST_FLAG
        });

      expect(response.status).toBe(401);
    });
  });

  describe('User Authentication', () => {
    test('successfully logs in with valid credentials', async () => {
      const testEmail = `login.test.${Date.now()}@test.com`;
      const testPassword = 'password123';
      
      const loginTestUser = new User({
        email: testEmail,
        password: testPassword,
        name: 'Login Test User',
        testFlag: TEST_FLAG
      });
      await loginTestUser.save();

      const savedUser = await User.findOne({ email: testEmail });
      expect(savedUser).toBeTruthy();
      
      const response = await request(app)
        .post('/api/users/login') 
        .send({
          email: testEmail,
          password: testPassword
        });

      if (response.status !== 200) {
        console.log('Login failed:', {
          status: response.status,
          body: response.body,
          userEmail: testEmail
        });
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('fails to login with incorrect credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: `nonexistent${Date.now()}@test.com`,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(404);
    });
  });
});