const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Client = sequelize.define(
  'Client',
  {
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    redirect_uri: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'Clients',
  }
);

module.exports = Client;
