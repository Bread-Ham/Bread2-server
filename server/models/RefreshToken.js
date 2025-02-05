import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Client from './Client.js';

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

export default RefreshToken;
