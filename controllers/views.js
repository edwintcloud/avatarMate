const app = require("express").Router();
const { user } = require("../models");
const { mailer } = require("../services");

// GET INDEX
app.get("/", (req, res, next) => {
  res.render("index");
});

// GET SIGNUP
app.get("/signup", (req, res, next) => {
  res.render("signup");
});

// GET LOGIN
app.get("/login", (req, res, next) => {
  res.render("login");
});

// CREATE ACCOUNT
app.post("/signup", (req, res, next) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.render("error", { error: `Passwords must match!` });
  }
  user
    .create(req.body)
    .then(createdUser => {
      mailer.sendMail(createdUser.email, createdUser.apiKey);
      req.session.user = createdUser;
      res.render("error", {
        error: `Account created! An email has been sent to ${
          createdUser.email
        } with your account details. You will be redirected to the home page in 5 seconds.
      <script>
        setTimeout(function () {
          // after 2 seconds
          window.location = "/";
        }, 5000)
      </script>
      `
      });
    })
    .catch(error => {
      if (error.code == 11000) {
        res.render("error", {
          error: `User already registered with specified email, please login to retrieve your API key!`
        });
      } else if (error.errors.email) {
        res.render("error", { error: `Not a valid email!` });
      } else if (error.errors.password) {
        res.render("error", { error: error.errors.password });
      } else {
        res.render("error", { error: error.message });
      }
    });
});

// LOGIN ACCOUNT
app.post("/login", (req, res, next) => {
  user
    .authenticate(req.body.email, req.body.password)
    .then(user => {
      req.session.user = user;
      res.redirect("/");
    })
    .catch(error => {
      res.render("error", { error: error.message });
    });
});

// LOGOUT ACCOUNT
app.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

// RESEND API KEY
app.get("/recover", (req, res, next) => {
  if(!req.session.user) return;
  mailer.sendMail(req.session.user.email, req.session.user.apiKey);
  res.render("error", { error: `Account details sent to ${req.session.user.email}. Please check your email!` });
});

module.exports = app;
