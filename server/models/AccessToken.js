const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');

const AccessToken = sequelize.define(
  'AccessToken',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'AccessTokens',
  }
);

AccessToken.belongsTo(User, { foreignKey: 'user_id' });
AccessToken.belongsTo(Client, { foreignKey: 'client_id' });

module.exports = AccessToken;
