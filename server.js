require("dotenv").config();
const nunjucks = require('nunjucks');
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const v1Controllers = require("./controllers/v1");
const { errorHandler, notFoundHandler, rateLimiter } = require("./middlewares");
const helmet = require("helmet");
const views = require('./controllers/views');
const { db } = require("./services");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

// connect to mongodb
const dbConnection = db.connect();

// Setup express to use our session - make sure to set your secure secret!
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 1800000  // 30 minutes (in ms) and our session will expire
  },
  store: new MongoStore({
      mongooseConnection: dbConnection
  })
}));

// Configure nunjucks templating engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');
app.set('views', './views');

// setup express to use json
app.use(express.json());

// setup express to handle binary and multipart form data for photo upload
app.use(express.urlencoded({
  extended: true,
  limit: "5mb"
}));

// setup express to use helmet middleware
app.use(helmet());

// Apply our rate limiter middleware to all routes
app.use(rateLimiter);

// Set a local variable to hold session before routes for template usage
app.use((req, res, next) => {
  if(req.session) {
    res.locals.session = req.session.user;
  } else {
    res.locals.session = undefined;
  }
  next();
});

// Use views controller to display our templates for front-end
app.use(views);

// register our v1 api controllers with the server
for (var k in v1Controllers) {
  app.use("/api/v1", v1Controllers[k]);
}

// If no routes found then send to notFoundHandler
app.use(notFoundHandler);

// All errors will be sent here and displayed to the user in json format
app.use(errorHandler);

// start server
app.listen(port, () => {
  console.log(
    "\x1b[35m%s\x1b[0m",
    `\nExpress listening for requests on PORT ${port}\n`
  );
});

// Export our express server to be used for tests
module.exports = app;
