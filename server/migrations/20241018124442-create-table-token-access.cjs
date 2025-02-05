'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'AccessTokens', schema: 'app' },
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        token: {
          type: Sequelize.STRING(2048), // Plus long pour les JWT
          allowNull: false,
          unique: true,
        },
        scope: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        expires_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        client_id: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'Clients',
              schema: 'app',
            },
            key: 'id',
          },
          allowNull: false,
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: 'Users',
              schema: 'app',
            },
            key: 'id',
          },
          allowNull: true, // Important : permettre NULL pour les client credentials
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );

    // Index pour améliorer les performances
    await queryInterface.addIndex(
      { tableName: 'AccessTokens', schema: 'app' },
      ['token'],
      {
        unique: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'AccessTokens', schema: 'app' });
  }
};