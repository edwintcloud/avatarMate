const app = require('express')();

app.get('/avatars', (req, res, next) => {
  res.json({
    message: `${req.method} ${req.originalUrl} not implemented`
  });
});

module.exports = app;