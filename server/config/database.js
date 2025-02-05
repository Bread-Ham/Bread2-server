import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'oauth_db',
  process.env.DB_USER || 'oauth_user',
  process.env.DB_PASSWORD || 'oauth_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'app',
    logging: false
  }
);

export default sequelize;
