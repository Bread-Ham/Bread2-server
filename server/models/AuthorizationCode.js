const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Client = require('./Client');

const AuthorizationCode = sequelize.define(
  'AuthorizationCode',
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    redirect_uri: {
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
    tableName: 'AuthorizationCodes',
  }
);

AuthorizationCode.belongsTo(User, { foreignKey: 'user_id' });
AuthorizationCode.belongsTo(Client, { foreignKey: 'client_id' });

module.exports = AuthorizationCode;
