const express = require("express");
const router = express.Router();
const hotActController = require("../Controllers/hotActController");
const tokenAuth = require("../Middlewares/tokenAuth");


router.post("/",tokenAuth,hotActController.post_createHotAct)



module.exports = router;