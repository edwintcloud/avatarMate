require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const controllers = require('./controllers');
const { errorHandler, notFoundHandler, rateLimiter } = require('./middlewares');
const helmet = require('helmet');

// setup express to use json
app.use(express.json());

// setup express to use helmet middleware
app.use(helmet());

// Apply our rate limiter middleware to all routes
app.use(rateLimiter);

// register our controllers with the server
for(var k in controllers) {
  app.use(controllers[k]);
}

// If no routes found then send to notFoundHandler
app.use(notFoundHandler);

// All errors will be sent here and displayed to the user in json format
app.use(errorHandler);


// start server
app.listen(port, () => {
  console.log(`Server listening for requests on PORT ${port}`)
});

// Export our express server to be used for tests
module.exports = app;