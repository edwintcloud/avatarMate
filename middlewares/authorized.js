const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // if we are using a server session, set req.userId and return
  if(req.session.hasOwnProperty('user')) {
    req.userId = req.session.user._id;
    return next();
  }

  // check that authorization header is set
  if(!req.headers.authorization || req.headers.authorization.split(' ')[0] != 'Bearer') {
    res.status(401);
    return next(new Error(`Unauthorized - No header set, please set authorization header with your API key.`));
  }

  // verify jwt was sent by this server and decode userid from jwt
  jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, function(err, decoded) {
    if(err) {
      res.status(401);
      return next(new Error(`Unauthorized - Invalid signature, please ensure your API key is valid.`));
    }

    // set user id in req and continue
    req.userId = decoded._id;
    next();
  });
};