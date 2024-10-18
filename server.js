import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const users = [{ id: 1, username: 'test', password: 'password' }];

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'mon_secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 600000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username);
  if (!user) {
    return done(null, false, { message: 'Utilisateur non trouvé' });
  }
  if (user.password !== password) {
    return done(null, false, { message: 'Mot de passe incorrect' });
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {

    return res.redirect('/login');
  }
  res.send(`Vous êtes connecté en tant que ${req.user.username}`);
});

app.get('/', (req, res) => {
  if (!req.session.views) {
    req.session.views = 1;
  } else {
    req.session.views++;
  }

  res.send(`Hello World! Vous avez visité cette page ${req.session.views} fois.`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
