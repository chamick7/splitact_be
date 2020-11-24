const express = require("express");
const router = express.Router();
const tokenAuth = require("../Middlewares/tokenAuth");
const multer = require("multer");

const fileUpload = require("express-fileupload");

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/file");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadFile = multer({ storage: fileStorage }).array("file", 5);

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const uploadImg = multer({ storage: imgStorage }).single("file");

const fileController = require("../Controllers/fileController");

router.post(
  "/upload",
  tokenAuth,
  (req, res, next) => {
    uploadFile(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err);
      }

      next();
    });
  },
  fileController.post_uploadFile
);

router.post(
  "/img/upload",
  tokenAuth,
  uploadImg,
  fileController.post_uploadProfile
);

router.get("/download/:fileName", tokenAuth, fileController.get_dowload);

module.exports = router;
