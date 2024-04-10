const { Pool } = require('pg');
const express = require('express');
const path = require('path');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const app = express();
const port = 3001;

// Database connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// View setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Passport configuration
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  const user = await pool.query('SELECT * FROM public."Logins" WHERE email = $1', [email]);
  if (user.rows.length === 0) {
    return done(null, false, { message: 'No user with that email.' });
  }
  try {
    if (await bcrypt.compare(password, user.rows[0].password)) {
      return done(null, user.rows[0]);
    } else {
      return done(null, false, { message: 'Incorrect password was entered.' });
    }
  } catch (error) {
    return done(error);
  }
}));
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await pool.query('SELECT * FROM public."Logins" WHERE id = $1', [id]);
  done(null, user.rows[0]);
});

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(flash());

// Routes
const indexRoutes = require('./src/routes/index');
app.use('/', indexRoutes);

// Express app setup
app.get('/', (req, res) => {
  res.render('index', { user: req.user ? req.user.username : null });
});

app.get('/404', (req, res) => {
  res.render('404');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('index');
});

app.get('/profile/:userId', checkAuthenticated, async (req, res) => {
  const user = await getUser(req.params.userId);
  res.render('profile', { user });
});

app.get('/profile', checkAuthenticated, async (req, res) => {
  const user = await getUser(req.user.id);
  res.render('profile', { user });
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  return next();
}

app.get('/query/:word', checkAuthenticated, async (req, res) => {
  const results = await logins.findByQuery(req.params.word);
  res.json(results);
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const result = await pool.query('INSERT INTO public."Logins"(username, email, password, uuid) VALUES ($1, $2, $3, $4) RETURNING id', [req.body.name, req.body.email, hashedPassword, uuid.v4()]);
    res.redirect('/login');
  } catch (error) {
    req.flash('error', 'Registration failed. Please try again.');
    res.redirect('/register');
  }
});

app.delete('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
});

// Server start
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Utility function
async function getUser(userId) {
  const user = await pool.query('SELECT * FROM public."Logins" WHERE id = $1', [userId]);
  return user.rows[0];
}