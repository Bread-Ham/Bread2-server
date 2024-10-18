'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
async up(queryInterface, Sequelize) {
  await queryInterface.createTable(
    { tableName: 'AuthorizationCodes', schema: 'app' },
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      redirect_uri: {
        type: Sequelize.STRING,
        allowNull: true,
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
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    }
  );
},

async down(queryInterface, Sequelize) {
  await queryInterface.dropTable({ tableName: 'AuthorizationCodes', schema: 'app' });
}

};