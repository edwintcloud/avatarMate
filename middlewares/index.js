const errorHandler = require('./errorHandler');
const notFoundHandler = require('./notFoundHandler');
const rateLimiter = require('./rateLimiter');
const authorized = require('./authorized');

module.exports = { errorHandler, notFoundHandler, rateLimiter, authorized };