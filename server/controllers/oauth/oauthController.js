import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import Client from '../../models/Client.js';
import User from '../../models/User.js';
import AccessToken from '../../models/AccessToken.js';
import RefreshToken from '../../models/RefreshToken.js';
import Auth from '../../middlewares/auth.js';

// Stockage temporaire des codes d'autorisation (à remplacer par Redis en production)
const authorizationCodes = new Map();

class OAuthController {
    /**
     * Gère la demande d'autorisation OAuth
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static async authorize(req, res) {
        try {
            const { client_id, redirect_uri, scope, state, response_type } = req.query;

            // Validation des paramètres
            if (!client_id || !redirect_uri || response_type !== 'code') {
                return res.status(400).json({ 
                    error: 'invalid_request',
                    error_description: 'Paramètres manquants ou invalides'
                });
            }

            // Vérification du client
            const client = await Client.findOne({ where: { client_id } });
            if (!client || client.redirect_uri !== redirect_uri) {
                return res.status(401).json({ 
                    error: 'unauthorized_client',
                    error_description: 'Client non autorisé'
                });
            }

            // Génération du code d'autorisation
            const code = uuidv4();
            authorizationCodes.set(code, {
                client_id: client.id,
                scope,
                expires: Date.now() + 600000 // 10 minutes
            });

            // Redirection avec le code
            const redirectUrl = new URL(redirect_uri);
            redirectUrl.searchParams.append('code', code);
            if (state) {
                redirectUrl.searchParams.append('state', state);
            }
            
            res.redirect(redirectUrl.toString());
        } catch (error) {
            console.error('Erreur d\'autorisation:', error);
            res.status(500).json({ 
                error: 'server_error',
                error_description: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Gère l'échange de tokens
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static async token(req, res) {
        try {
            const { grant_type, code, refresh_token, client_id, client_secret } = req.body;

            // Vérification du client
            const client = await Client.findOne({
                where: { client_id, client_secret }
            });

            if (!client) {
                return res.status(401).json({ 
                    error: 'invalid_client',
                    error_description: 'Client non autorisé'
                });
            }

            if (grant_type === 'authorization_code') {
                await OAuthController.handleAuthorizationCode(code, client, res);
            } else if (grant_type === 'refresh_token') {
                await OAuthController.handleRefreshToken(refresh_token, client, res);
            } else {
                res.status(400).json({ 
                    error: 'unsupported_grant_type',
                    error_description: 'Type de grant non supporté'
                });
            }
        } catch (error) {
            console.error('Erreur d\'échange de token:', error);
            res.status(500).json({ 
                error: 'server_error',
                error_description: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Gère l'échange du code d'autorisation contre des tokens
     * @private
     */
    static async handleAuthorizationCode(code, client, res) {
        const codeData = authorizationCodes.get(code);
        if (!codeData || codeData.expires < Date.now()) {
            return res.status(400).json({ 
                error: 'invalid_grant',
                error_description: 'Code invalide ou expiré'
            });
        }

        authorizationCodes.delete(code);

        const accessToken = jwt.sign(
            { client_id: client.id, scope: codeData.scope },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = uuidv4();

        await AccessToken.create({
            token: accessToken,
            client_id: client.id,
            scope: codeData.scope,
            expires_at: new Date(Date.now() + 3600000) // 1 heure
        });

        await RefreshToken.create({
            token: refreshToken,
            client_id: client.id,
            expires_at: new Date(Date.now() + 30 * 24 * 3600000) // 30 jours
        });

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600,
            refresh_token: refreshToken,
            scope: codeData.scope
        });
    }

    /**
     * Gère le rafraîchissement d'un token
     * @private
     */
    static async handleRefreshToken(refresh_token, client, res) {
        const refreshTokenObj = await RefreshToken.findOne({
            where: { token: refresh_token, client_id: client.id }
        });

        if (!refreshTokenObj || refreshTokenObj.expires_at < new Date()) {
            return res.status(400).json({ 
                error: 'invalid_grant',
                error_description: 'Refresh token invalide ou expiré'
            });
        }

        const accessToken = jwt.sign(
            { client_id: client.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        await AccessToken.create({
            token: accessToken,
            client_id: client.id,
            expires_at: new Date(Date.now() + 3600000)
        });

        res.json({
            access_token: accessToken,
            token_type: 'Bearer',
            expires_in: 3600
        });
    }

    /**
     * Renvoie les informations de l'utilisateur authentifié
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static async userInfo(req, res) {
        try {
            res.json({
                sub: req.user.id,
                email: req.user.email,
                name: req.user.name,
                updated_at: req.user.updated_at
            });
        } catch (error) {
            console.error('Erreur userinfo:', error);
            res.status(500).json({ 
                error: 'server_error',
                error_description: 'Erreur interne du serveur'
            });
        }
    }

    /**
     * Révoque un token
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    static async revokeToken(req, res) {
        try {
            const { token, token_type_hint } = req.body;

            if (!token) {
                return res.status(400).json({
                    error: 'invalid_request',
                    error_description: 'Token manquant'
                });
            }

            if (token_type_hint === 'access_token') {
                await AccessToken.destroy({ where: { token } });
            } else if (token_type_hint === 'refresh_token') {
                await RefreshToken.destroy({ where: { token } });
            } else {
                await AccessToken.destroy({ where: { token } });
                await RefreshToken.destroy({ where: { token } });
            }

            res.status(200).send();
        } catch (error) {
            console.error('Erreur de révocation:', error);
            res.status(500).json({ 
                error: 'server_error',
                error_description: 'Erreur interne du serveur'
            });
        }
    }
}

export default OAuthController;
