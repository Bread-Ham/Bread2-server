import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
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

import User from './User.js';

Client.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

export default Client;
