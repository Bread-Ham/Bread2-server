import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// Import des routes
import oauthRoutes from './routes/oauth.js';

// Import de la configuration de la base de données
import sequelize from './config/database.js';

dotenv.config();

const app = express();

// Test de la connexion à la base de données
sequelize.authenticate()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch(err => console.error('Impossible de se connecter à la base de données:', err));

// Configuration CORS correcte
app.use(cors({
  origin: 'http://localhost:5173',  // Autorise uniquement le front-end
  credentials: true,                // Autorise les cookies/session
}));

// Parse les requêtes JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration des routes OAuth
app.use('/oauth', oauthRoutes);

// Configuration de la stratégie Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// Sérialisation et désérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:5173/profile');  // Redirection vers le front
  }
);

// Route pour récupérer les infos de l'utilisateur connecté
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Non authentifié' });
  }
});

// Route de déconnexion
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.clearCookie('connect.sid');  // Supprimer le cookie de session
    res.status(200).json({ message: 'Déconnecté' });  // ✅ Réponse simple
  });
});

// Démarrer le serveur
const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
});
