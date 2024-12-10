const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

// Users (for demo purposes)
const users = [{ id: 1, username: 'user', passwordHash: bcrypt.hashSync('password', 10) }];

// Passport Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
  const user = users.find(u => u.username === username);
  if (!user) return done(null, false, { message: 'Invalid username' });
  if (!bcrypt.compareSync(password, user.passwordHash)) return done(null, false, { message: 'Invalid password' });
  return done(null, user);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user || false);
});

// Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.post('/login', passport.authenticate('local', {
  successRedirect: '/explorer',
  failureRedirect: '/',
}));
app.get('/explorer', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'explorer.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
