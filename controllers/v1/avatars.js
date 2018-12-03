const app = require("express")();
const multer = require("multer");
const { image } = require("../../services");
const { authorized } = require("../../middlewares");

// multer setup
const uploader = multer({
  storage: multer.memoryStorage()
}).single("avatar");

app.get("/avatars/:id", (req, res, next) => {
  // TODO: find base64 avatar in db and convert to file, sending file to client
  res.json({
    message: `${req.method} ${req.originalUrl} not implemented`
  });
});

app.post("/avatars", authorized, (req, res, next) => {
  // TODO: save avatar in db
  console.log(req.userId)
  const id = req.userId;
  uploader(req, res, err => {
    if (err)
      return next(
        new Error(
          `${
            err.message
          } - make sure you are using form-data upload and the key is set to avatar.`
        )
      );
    // get file extension and make sure it is supported
    const ext = /(?:\.([^.]+))?$/.exec(req.file.originalname)[1];
    if (ext != "png" && ext != "jpg" && ext != "jpeg") {
      return next(new Error(`File type ${ext} not supported.`));
    }
    // do image conversions using image service
    image(req.file.buffer, req.body)
      .then(result => {
        res.json({
          link: `${req.protocol}://${req.get("host")}${req.originalUrl}/${id}`,
          base64: result
        });
      })
      .catch(err => next(err));
  });
});

module.exports = app;
