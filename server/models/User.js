// models/user.js
import { DataTypes } from 'sequelize';
import sequelize from '../database'; // Assurez-vous que cela pointe vers le fichier 'database.js'

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Users', // Le nom de votre table PostgreSQL
  schema: 'app', // Le schéma "app" vu dans votre capture d'écran
});

export default User;