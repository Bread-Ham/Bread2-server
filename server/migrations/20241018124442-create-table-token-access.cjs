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
          type: Sequelize.STRING,
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
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
        },
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({ tableName: 'AccessTokens', schema: 'app' });
  }
};