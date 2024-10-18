import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // Charge les variables d'environnement depuis un fichier .env

// 1. Configuration de Sequelize directement dans ce fichier
const sequelize = new Sequelize(
  process.env.DB_NAME || 'oauth_db',
  process.env.DB_USER || 'oauth_user',
  process.env.DB_PASSWORD || 'oauth_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
  }
);

// 2. Définir le modèle `User` avec Sequelize
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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'Users',  // Assurez-vous que cela correspond exactement au nom de la table dans PostgreSQL
  schema: 'app',       // Utilisez le schéma `app` selon votre capture d'écran
});

// 3. Script pour peupler la base de données avec des utilisateurs
const seedUsers = async () => {
  try {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync();

    // Hachage des mots de passe avant l'insertion
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    const hashedPassword3 = await bcrypt.hash('password789', 10);

    // Insertion des utilisateurs fictifs dans la base de données
    await User.bulkCreate([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword1, // Mot de passe haché
      },
      {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: hashedPassword2, // Mot de passe haché
      },
      {
        username: 'alice_smith',
        email: 'alice@example.com',
        password: hashedPassword3, // Mot de passe haché
      },
    ]);

    console.log('Utilisateurs ajoutés avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'ajout des utilisateurs:', error);
  } finally {
    await sequelize.close(); // Ferme la connexion à la base de données
  }
};

// 4. Appel de la fonction pour peupler la base de données
seedUsers();