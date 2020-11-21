const express = require('express');
const router = express.Router();
const listController = require('../Controllers/listController');
const tokenAuth = require("../Middlewares/tokenAuth");
const tokenGet = require("../Middlewares/tokenGet");


router.post("/edit",tokenAuth,listController.post_editList);



module.exports = router;