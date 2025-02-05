import bcrypt from 'bcrypt';
import User from '../models/User.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    const passwordHash = await bcrypt.hash('test_password', 10);
    const testUser = await User.create({
      username: 'test_user',
      password_hash: passwordHash,
      email: 'test@example.com'
    });

    console.log('Test user created:', testUser.toJSON());
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

createTestUser();
