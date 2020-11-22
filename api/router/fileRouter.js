const express = require("express");
const router = express.Router();
const tokenAuth = require("../Middlewares/tokenAuth");
const fileController = require("../Controllers/fileController");

router.post("/upload", fileController.post_uploadFile);

router.post("/img/upload", tokenAuth, fileController.post_uploadProfile);

module.exports = router;
