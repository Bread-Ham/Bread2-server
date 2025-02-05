'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'Clients', schema: 'app' },
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        client_id: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        client_secret: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        redirect_uri: {
          type: Sequelize.STRING,
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
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        created_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );

    await queryInterface.addIndex(
      { tableName: 'Clients', schema: 'app' },
      ['client_id'],
      { unique: true }
    );
  },
  async down(queryInterface) {
    await queryInterface.dropTable({ tableName: 'Clients', schema: 'app' });
  },
};