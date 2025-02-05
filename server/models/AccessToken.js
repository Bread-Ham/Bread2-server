import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Client from './Client.js';

const AccessToken = sequelize.define(
  'AccessToken',
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    scope: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'AccessTokens',
  }
);

AccessToken.belongsTo(User, { foreignKey: 'user_id' });
AccessToken.belongsTo(Client, { foreignKey: 'client_id' });

export default AccessToken;
