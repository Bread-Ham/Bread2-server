// Charger les variables d'environnement
import dotenv from 'dotenv';
dotenv.config();

// Importation des modules nécessaires
import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';

// Initialisation de l'application Express
const app = express();

// Configuration de la session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de Passport pour utiliser Google OAuth 2.0
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

// Sérialisation et désérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Route principale
app.get('/', (req, res) => {
    res.send('<h1>Accueil</h1><a href="/auth/google">Se connecter avec Google</a>');
});

// Route pour déclencher l'authentification avec Google
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Route de callback après l'authentification réussie
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

// Route pour afficher le profil de l'utilisateur après connexion
app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.send(`<h1>Profil</h1><p>Nom : ${req.user.displayName}</p><a href="/logout">Se déconnecter</a>`);
});

// Route pour gérer la déconnexion
app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

// Lancer le serveur
app.listen(3000, () => {
    console.log('Serveur en cours d\'exécution sur http://localhost:3000');
});