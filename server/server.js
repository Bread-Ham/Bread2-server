import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { Sequelize } from 'sequelize';
// import { bcrypt } from 'bcrypt';

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
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch((err) =>
    console.error('Impossible de se connecter à la base de données:', err)
  );

const app = express();

// Configuration de la session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialisation de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuration de Passport pour utiliser Google OAuth 2.0
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

// Sérialisation et désérialisation de l'utilisateur dans la session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Route principale
app.get('/', (req, res) => {
  res.send(
    '<h1>Accueil</h1><a href="/auth/google">Se connecter avec Google</a>'
  );
});

// Route pour déclencher l'authentification avec Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Route de callback après l'authentification réussie
app.get(
  '/auth/google/callback',
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
  res.send(
    `<h1>Profil</h1><p>Nom : ${req.user.displayName}</p><a href="/logout">Se déconnecter</a>`
  );
});

// Route pour gérer la déconnexion
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

const port = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
});
