const app = require("express")();
const multer = require("multer");
const jimp = require("jimp");

// multer setup
const uploader = multer({
  dest: "uploads/",
  storage: multer.memoryStorage()
}).single("avatar");

app.get("/avatars", (req, res, next) => {
  res.json({
    message: `${req.method} ${req.originalUrl} not implemented`
  });
});

app.post("/avatars", (req, res, next) => {
  
  // begin upload using multer
  uploader(req, res, err => {
    console.log(req.body); // TODO: deal with options for file encoding and using jimp to convert stream
    if (err) {
      return next(
        new Error(
          `${
            err.message
          } - make sure you are using form-data upload and the key is set to avatar.`
        )
      );
    }

    // get file extension and make sure it is supported
    const ext = /(?:\.([^.]+))?$/.exec(req.file.originalname)[1];
    if (ext != "png" && ext != "jpg" && ext != "jpeg") {
      return next(new Error(`File type ${ext} not supported.`));
    }

    // use jimp to do stuff to image
    jimp
      .read(req.file.buffer)
      .then(img => {
        img
          .resize(300, 300)
          .quality(50)
          .getBase64Async(jimp.MIME_PNG)
          .then(base64 => {

            // convert buffer to base 64 and send as json resp
            res.json({
              base64: base64
            });
          });
      })
      .catch(err => {
        next(err);
      });
  });
});

module.exports = app;
