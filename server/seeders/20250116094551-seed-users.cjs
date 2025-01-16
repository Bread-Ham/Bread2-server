'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hacher les mots de passe avant de les insérer
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    const hashedPassword3 = await bcrypt.hash('password789', 10);

    // Insérer des utilisateurs fictifs
    await queryInterface.bulkInsert(
      {
        tableName: 'Users',
        schema: 'app',
      },
      [
        {
          username: 'john_doe',
          email: 'john@example.com',
          password_hash: hashedPassword1, // Mot de passe haché
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'jane_doe',
          email: 'jane@example.com',
          password_hash: hashedPassword2, // Mot de passe haché
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          username: 'alice_smith',
          email: 'alice@example.com',
          password_hash: hashedPassword3, // Mot de passe haché
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]
    );
  },

  async down(queryInterface, Sequelize) {
    // Supprimer les utilisateurs fictifs
    await queryInterface.bulkDelete('Users', null, {});
  },
};
