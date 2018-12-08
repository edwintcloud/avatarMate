module.exports = function(error, req, res, next) {
  if (req.session.hasOwnProperty('user')) {
    res.render("error", { error: error.message });
  } else {
    res.status(res.statusCode || 500);
    res.json({
      error: error.message
    });
  }
};
