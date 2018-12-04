const app = require('express').Router();

// GET INDEX
app.get('/', (req, res, next) => {
  res.render('index');
});

// GET SIGNUP
app.get('/signup', (req, res, next) => {
  res.render('signup');
});

// GET LOGIN
app.get('/login', (req, res, next) => {
  res.render('login');
});

module.exports = app;