const app = require("express")();
const multer = require("multer");
const { image } = require("../../services");
const { authorized } = require("../../middlewares");
const { avatar } = require('../../models');

// multer setup
const uploader = multer({
  storage: multer.memoryStorage()
}).single("avatar");


// GET ALL AVATARS FOR USER
app.get('/avatars', authorized, (req, res, next) => {
  // TODO: return all avatars for authorized user req.userId
  res.json({
    message: `${req.method} ${req.originalUrl} not implemented`
  });
});

// GET AVATAR BY ID
app.get("/avatars/:id", authorized, (req, res, next) => {
  avatar.find({ _id: req.params.id, uploadedBy: req.userId }).limit(1).lean().then(result => {
    // ensure image was found
    if(result.length == 0) {
      return next(new Error(`Image not found or not created by current authorized user`));
    }

    const data = result[0].data;
    const img = Buffer.from(data.substring(data.indexOf(',') + 1), 'base64');
    const imgType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));

    res.writeHead(200, {
      'Content-Type': imgType,
      'Content-Length': img.length
    });
    res.end(img);
  }).catch(err => next(err));
});

// UPLOAD AVATAR
app.post("/avatars", authorized, (req, res, next) => {
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

        // save image to database
        avatar.create({
          data: result,
          uploadedBy: req.userId
        }).then(savedImg => {
          // send json response to client
          res.json({
            link: `${req.protocol}://${req.get("host")}${req.originalUrl}/${savedImg._id}`,
            base64: savedImg.data
          });
        }).catch(err => next(err));
        
      })
      .catch(err => next(err));
  });
});

module.exports = app;
