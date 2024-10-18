// database.js
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config(); // Charge les variables d'environnement depuis le fichier .env

// Crée une nouvelle instance de Sequelize pour se connecter à PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'oauth_db',        // Nom de la base de données
  process.env.DB_USER || 'oauth_user',      // Nom d'utilisateur
  process.env.DB_PASSWORD || 'oauth_password',  // Mot de passe
  {
    host: process.env.DB_HOST || 'localhost',   // Adresse du serveur
    port: process.env.DB_PORT || 5432,          // Port (par défaut 5432 pour PostgreSQL)
    dialect: 'postgres',                        // Utilisation de PostgreSQL comme SGBD
    logging: false,                             // Désactiver les logs SQL dans la console
  }
);

// Tester la connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((err) => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

// Définir le modèle User
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
  tableName: 'Users',  // Assurez-vous que cela correspond au nom exact de votre table
  schema: 'app',       // Schéma 'app' que vous utilisez
  timestamps: true,    // Active la gestion des timestamps
  createdAt: 'created_at',  // Spécifie le mapping vers la colonne created_at
  updatedAt: 'updated_at',  // Spécifie le mapping vers la colonne updated_at
});

// Fonction pour peupler la base de données avec des utilisateurs
const seedUsers = async () => {
  try {
    // Synchroniser le modèle avec la base de données
    await sequelize.sync();

    // Hacher les mots de passe avant de les insérer
    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('password456', 10);
    const hashedPassword3 = await bcrypt.hash('password789', 10);

    // Créer des utilisateurs fictifs
    await User.bulkCreate([
      {
        username: 'john_doe',
        email: 'john@example.com',
        password_hash: hashedPassword1,  // Mot de passe haché
      },
      {
        username: 'jane_doe',
        email: 'jane@example.com',
        password_hash: hashedPassword2,  // Mot de passe haché
      },
      {
        username: 'alice_smith',
        email: 'alice@example.com',
        password_hash: hashedPassword3,  // Mot de passe haché
      },
    ]);

    console.log('Utilisateurs ajoutés avec succès!');
  } catch (err) {
    console.error('Erreur lors de l\'ajout des utilisateurs :', err);
  } finally {
    // Fermer la connexion à la base de données après l'insertion
    sequelize.close();
  }
};

// Exécuter la fonction d'importation des utilisateurs
seedUsers();

export default sequelize;