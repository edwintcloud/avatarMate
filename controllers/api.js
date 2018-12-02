const app = require('express')();

app.get('/', (req, res) => {
  res.json({
    message: `Welcome to avatarMate api 🎉!`
  });
});

// export controller
module.exports = app;