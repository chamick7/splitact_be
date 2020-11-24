const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/contactController");

router.post("/", contactController.post_sendContact);

module.exports = router;
