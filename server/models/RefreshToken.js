const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'RefreshTokens',
  }
);

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });
RefreshToken.belongsTo(Client, { foreignKey: 'client_id' });

module.exports = RefreshToken;
