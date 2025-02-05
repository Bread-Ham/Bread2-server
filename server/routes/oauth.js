import express from 'express';
import { auth } from '../middlewares/auth.js';
import OAuthController from '../controllers/oauth/oauthController.js';

const router = express.Router();

/**
 * Route d'autorisation OAuth
 * Le client redirige l'utilisateur vers cette route pour demander son autorisation
 */
router.get('/authorize', OAuthController.authorize);

/**
 * Route d'échange de tokens
 * Le client échange un code d'autorisation contre des tokens d'accès
 */
router.post('/token', OAuthController.token);

/**
 * Route d'informations utilisateur
 * Renvoie les informations de l'utilisateur authentifié
 */
router.get('/userinfo', auth, OAuthController.userInfo);

/**
 * Route de révocation de token
 * Permet de révoquer un access token ou un refresh token
 */
router.post('/revoke', OAuthController.revokeToken);

export default router;
