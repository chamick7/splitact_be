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

const fileController = require("../Controllers/fileController");

router.post("/upload", tokenAuth, uploadFile, fileController.post_uploadFile);

router.post("/img/upload", tokenAuth, fileController.post_uploadProfile);

router.get("/download/:fileName",tokenAuth, fileController.get_dowload);

module.exports = router;
