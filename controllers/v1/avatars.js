const app = require("express")();
const multer = require("multer");
const { image, db } = require("../../services");
const { authorized } = require("../../middlewares");
const { avatar } = require("../../models");

// multer setup
const uploader = multer({
  storage: multer.memoryStorage()
}).single("avatar");

// GET ALL AVATARS FOR USER
app.get("/avatars", authorized, (req, res, next) => {
  avatar
    .find({ uploadedBy: req.userId })
    .lean()
    .then(result => {
      if (result.length == 0) {
        return next(new Error(`No Avatars exist for current user`));
      }

      // return results
      res.json(
        result.map(x => {
          return {
            id: x._id,
            name: x.name,
            link: `${req.protocol}://${req.get("host")}${
              req.originalUrl
            }/view/${x._id}`
          };
        })
      );
    })
    .catch(err => next(err));
});

// GET AVATAR FOR USER BY ID
app.get("/avatars/:id", authorized, (req, res, next) => {
  // make sure param is a valid object id
  if (!db.isValidObjectId(req.params.id)) {
    return next(new Error(`Invalid objectId`));
  }
  avatar
    .find({ _id: req.params.id, uploadedBy: req.userId })
    .limit(1)
    .lean()
    .then(result => {
      if (result.length == 0) {
        return next(
          new Error(
            `Avatar does not exist or was not uploaded by currently authorized user`
          )
        );
      }
      res.json({
        name: result[0].name,
        link: `${req.protocol}://${req.get("host")}${req.originalUrl}/view/${
          result[0]._id
        }`,
        base64: result[0].data
      });
    })
    .catch(err => next(err));
});

// View AVATAR BY ID
app.get("/avatars/view/:id", (req, res, next) => {
  // make sure param is a valid object id
  if (!db.isValidObjectId(req.params.id)) {
    return next(new Error(`Invalid objectId`));
  }
  // find avatar in db
  avatar
    .find({ _id: req.params.id })
    .limit(1)
    .lean()
    .then(result => {
      // ensure image was found
      if (result.length == 0) {
        return next(
          new Error(`Image not found or not created by current authorized user`)
        );
      }

      const data = result[0].data;
      const img = Buffer.from(data.substring(data.indexOf(",") + 1), "base64");
      const imgType = data.substring(data.indexOf(":") + 1, data.indexOf(";"));

      res.writeHead(200, {
        "Content-Type": imgType,
        "Content-Length": img.length
      });
      res.end(img);
    })
    .catch(err => next(err));
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

    // ensure name is specified
    if (!req.body["name"] || req.body.name.length < 3) {
      return next(
        new Error(
          `Please specify a name greater than 3 characters for your avatar`
        )
      );
    }

    // do image conversions using image service
    image(req.file.buffer, req.body)
      .then(result => {
        // save image to database
        avatar
          .create({
            name: req.body.name,
            data: result,
            uploadedBy: req.userId
          })
          .then(savedImg => {
            // send json response to client
            res.json({
              link: `${req.protocol}://${req.get("host")}${
                req.originalUrl
              }/view/${savedImg._id}`,
              base64: savedImg.data
            });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  });
});

// PUT - CHANGE AVATAR NAME
app.put("/avatars/:id", authorized, (req, res, next) => {
  // make sure param is a valid object id
  if (!db.isValidObjectId(req.params.id)) {
    return next(new Error(`Invalid objectId`));
  }

  // make sure req.body.name exists and is at least 3 characters
  if (!req.body["name"] || req.body.name.length < 3) {
    return next(
      new Error(
        `Please specify a name greater than 3 characters for your avatar`
      )
    );
  }

  const updates = {
    name: req.body.name
  };

  // update name in db
  avatar
    .updateOne({ _id: req.params.id, uploadedBy: req.userId }, updates)
    .then(result => {
      if (result.n == 0) {
        return next(
          new Error(
            `Avatar does not exist or was not uploaded by currently authorized user`
          )
        );
      }
      res.json({
        message: `Successfully updated avatar name to ${updates.name}`
      });
    })
    .catch(err => next(err));
});

// DELETE AVATAR
app.delete("/avatars/:id", authorized, (req, res, next) => {
  // make sure param is a valid object id
  if (!db.isValidObjectId(req.params.id)) {
    return next(new Error(`Invalid objectId`));
  }

  // delete from db
  avatar
    .deleteOne({ _id: req.params.id, uploadedBy: req.userId })
    .then(result => {
      if (result.n == 0) {
        return next(
          new Error(
            `Avatar does not exist or was not uploaded by currently authorized user`
          )
        );
      }
      res.json({
        message: `Successfully deleted avatar ${req.params.id}`
      });
    })
    .catch(err => next(err));
});

module.exports = app;
