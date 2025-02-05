import Client from '../models/Client.js';
import User from '../models/User.js';
import sequelize from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createTestClient() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database');

    // Récupérer l'utilisateur test
    const testUser = await User.findOne({
      where: { username: 'test_user' }
    });

    if (!testUser) {
      throw new Error('Test user not found');
    }

    // Trouver le client existant
    let testClient = await Client.findOne({
      where: { client_id: 'test_client' }
    });

    if (testClient) {
      // Mettre à jour le client existant
      testClient = await testClient.update({
        user_id: testUser.id,
        redirect_uri: 'http://localhost:5173/callback'
      });
      console.log('Client mis à jour avec le nouvel utilisateur');
    } else {
      // Créer un nouveau client
      testClient = await Client.create({
        client_id: 'test_client',
        client_secret: 'test_secret',
        name: 'Test Application',
        redirect_uri: 'http://localhost:5173/callback',
        user_id: testUser.id
      });
      console.log('Nouveau client créé');
    }

    console.log('Test client created:', testClient.toJSON());
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

createTestClient();
