const app = require("express")();
const { user } = require("../../models");
const { mailer } = require("../../services");

app.get("/users", (req, res) => {
  res.json({
    message: `${req.method} ${req.originalUrl} not implemented`
  });
});

// CREATE NEW USER
app.post("/users", (req, res, next) => {
  user
    .create(req.body)
    .then(createdUser => {
      mailer.sendMail(createdUser.email, createdUser.apiKey);
      res.json({
        message: `Account created successfully! Please check your email for details.`
      });
    })
    .catch(error => {
      if (error.code == 11000) {
        res.status(409); // conflict oh no
        next(
          new Error(
            `User already registered with specified email, please login to retrieve your API key!`
          )
        );
      } else if (error.errors.email) {
        res.status(400);
        next(new Error(`Not a valid email!`));
      } else if (error.errors.password) {
        res.status(400);
        next(error.errors.password);
      } else {
        res.status(400);
        next(new Error(error.message));
      }
    });
});

// LOGIN/ RETREIVE API KEY
app.post("/users/login", (req, res, next) => {
  user
    .authenticate(req.body.email, req.body.password)
    .then(userRes => {
      mailer.sendMail(userRes.email, userRes.apiKey);
      res.json({
        message: `An email has been sent to ${
          userRes.email
        } with your account details.`
      });
    })
    .catch(error => {
      res.status(401);
      next(new Error(error.message));
    });
});

module.exports = app;
