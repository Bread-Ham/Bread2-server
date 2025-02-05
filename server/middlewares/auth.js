import jwt from 'jsonwebtoken';
import AccessToken from '../models/AccessToken.js';
import User from '../models/User.js';

class Auth {
  /**
   * Extrait le token Bearer des en-têtes HTTP
   * Le format attendu est: "Authorization: Bearer <token>"
   *
   * @param {Object} req - L'objet request Express
   * @returns {string|null} Le token extrait ou null si non trouvé
   */
  static extractBearerToken(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }

  /**
   * Vérifie la validité du JWT token
   * Utilise la clé secrète stockée dans les variables d'environnement
   *
   * @param {string} token - Le token JWT à vérifier
   * @returns {Object|null} Le contenu décodé du token ou null si invalide
   */
  static async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Erreur de vérification JWT:', error);
      return null;
    }
  }

  /**
   * Vérifie l'existence et la validité du token dans la base de données
   * Vérifie également si le token n'a pas expiré
   *
   * @param {string} token - Le token à valider
   * @returns {Object|null} L'objet AccessToken ou null si invalide
   */
  static async validateAccessToken(token) {
    try {
      const accessToken = await AccessToken.findOne({
        where: { token },
        include: ['client', 'user'],
      });

      if (!accessToken) {
        return null;
      }

      // Vérification de l'expiration
      if (new Date() > accessToken.expires_at) {
        await accessToken.destroy(); // Suppression des tokens expirés
        return null;
      }

      return accessToken;
    } catch (error) {
      console.error('Erreur de validation du token:', error);
      return null;
    }
  }

  /**
   * Récupère les informations de l'utilisateur depuis la base de données
   *
   * @param {number} userId - L'ID de l'utilisateur à récupérer
   * @returns {Object|null} L'objet User ou null si non trouvé
   */
  static async fetchUserInfo(userId) {
    try {
      return await User.findByPk(userId, {
        attributes: ['id', 'email', 'username'], // Sélection des champs à retourner
      });
    } catch (error) {
      console.error('Erreur de récupération utilisateur:', error);
      return null;
    }
  }

  /**
   * Middleware principal d'authentification OAuth
   * Ce middleware vérifie la présence et la validité du token Bearer dans les en-têtes HTTP
   * Il extrait ensuite les informations de l'utilisateur et les attache à l'objet request
   *
   * @param {Object} req - L'objet request Express
   * @param {Object} res - L'objet response Express
   * @param {Function} next - Fonction callback Express pour passer au middleware suivant
   */
  static async authenticate(req, res, next) {
    try {
      // Extraction du token Bearer
      const token = this.extractBearerToken(req);
      if (!token) {
        return res
          .status(401)
          .json({ error: "Token d'authentification manquant" });
      }

      // Vérification de la validité du token
      const decodedToken = await this.verifyToken(token);
      if (!decodedToken) {
        return res.status(401).json({ error: 'Token invalide' });
      }

      // Vérification de l'existence du token en base de données
      const accessToken = await this.validateAccessToken(token);
      if (!accessToken) {
        return res.status(401).json({ error: 'Token révoqué ou expiré' });
      }

      // Récupération des informations utilisateur
      const user = await this.fetchUserInfo(accessToken.user_id);
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      // Attachement des informations à l'objet request
      req.user = user;
      req.token = accessToken;

      next();
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  }

  /**
   * Middleware pour vérifier les scopes du token
   * Permet de restreindre l'accès à certaines routes en fonction des permissions
   *
   * @param {string[]} requiredScopes - Liste des scopes requis pour accéder à la route
   * @returns {Function} Middleware Express
   */
  static requireScopes(requiredScopes) {
    return (req, res, next) => {
      const tokenScopes = req.token.scope ? req.token.scope.split(' ') : [];

      const hasAllRequiredScopes = requiredScopes.every(scope =>
        tokenScopes.includes(scope)
      );

      if (!hasAllRequiredScopes) {
        return res.status(403).json({
          error: 'Permissions insuffisantes',
          required_scopes: requiredScopes,
        });
      }

      next();
    };
  }
}

export const auth = Auth.authenticate.bind(Auth);
export const requireScopes = Auth.requireScopes.bind(Auth);

export default Auth;
