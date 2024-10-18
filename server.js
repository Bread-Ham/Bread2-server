import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import OAuth2Server from 'oauth2-server';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;  // Utilisation de la variable d'environnement
const users = []; // Stock temporaire des utilisateurs (à remplacer par une base de données)

// OAuth 2.0 Server instance
const oauth = new OAuth2Server({
    model: {
        getClient: (clientId, clientSecret) => {
            const client = {
                clientId: 'client123',
                clientSecret: 'secret123',
                grants: ['authorization_code'],
                redirectUris: ['http://localhost:3000/callback'],
            };

            // Validation des identifiants client
            if (clientId === client.clientId && clientSecret === client.clientSecret) {
                return client;
            }

            return null; // Retourner null si les identifiants sont incorrects
        },
        saveToken: (token, client, user) => {
            // Sauvegarde le token dans la base de données
            token.client = client;
            token.user = user;
            return token;
        },
        getAccessToken: (accessToken) => {
            // Récupère le token d'accès (depuis une base de données par exemple)
            return accessToken ? { accessToken } : null;
        },
        getAuthorizationCode: (code) => {
            // Récupérer le code d'autorisation
            return code ? { authorizationCode: code } : null;
        },
        saveAuthorizationCode: (code, client, user) => {
            // Sauvegarder le code d'autorisation (base de données)
            return { authorizationCode: code, client, user };
        },
        revokeAuthorizationCode: (code) => {
            // Invalider un code d'autorisation après usage
            return true;
        },
        getUser: (username, password) => {
            // Recherche de l'utilisateur (à remplacer par une recherche en base de données)
            const user = users.find(u => u.email === username);
            if (user && bcrypt.compareSync(password, user.password)) {
                return user;
            }
            return null;
        },
    },
});

app.use(bodyParser.json());

// Route pour inscrire un utilisateur
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword };
    users.push(newUser); // Ajouter l'utilisateur (à remplacer par une base de données)

    res.json({ message: 'Utilisateur inscrit avec succès' });
});

// Route pour demander un code d'autorisation (OAuth 2.0)
app.get('/authorize', (req, res) => {
    const { client_id, client_secret, response_type, redirect_uri, scope } = req.query;

    // Assurez-vous que client_id et client_secret sont passés dans la requête
    if (!client_id || !client_secret) {
        return res.status(400).json({ error: 'Client ID and Client Secret are required' });
    }

    // Vérification si getClient est bien défini dans le modèle
    if (typeof oauth.model.getClient !== 'function') {
        return res.status(500).json({ error: 'getClient method not defined in the OAuth model' });
    }

    // Simule la récupération du client via le modèle OAuth
    const client = oauth.model.getClient(client_id, client_secret);

    if (!client) {
        return res.status(400).json({ error: 'Client credentials are invalid' });
    }

    // Si tout est bon, continuer avec le processus d'autorisation
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    oauth.authorize(request, response)
      .then((authorizationCode) => {
          res.json(authorizationCode);
      })
      .catch(err => {
          console.error(err);  // Log l'erreur pour une meilleure compréhension
          res.status(500).json({ error: err.message });
      });
});

// Route pour obtenir un token d'accès via le code d'autorisation
app.post('/token', (req, res) => {
    const request = new OAuth2Server.Request(req);
    const response = new OAuth2Server.Response(res);

    oauth.token(request, response)
      .then((token) => {
          res.json(token);
      }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});

// Route pour accéder aux infos utilisateur (via le token d'accès)
app.get('/userinfo', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);  // Utilisation du secret JWT depuis .env
        const user = users.find(u => u.email === decoded.email);
        res.json({ user });
    } catch (err) {
        res.status(403).json({ message: 'Token invalide' });
    }
});

// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});