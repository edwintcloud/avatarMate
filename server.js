require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const v1Controllers = require("./controllers/v1");
const { errorHandler, notFoundHandler, rateLimiter } = require("./middlewares");
const helmet = require("helmet");
const { db } = require("./services");

// connect to mongodb
db.connect();

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

// GET INDEX
app.get("/", (req, res) => {
  res.json({
    message: `Welcome to avatarMate api 🎉!`
  });
});

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
