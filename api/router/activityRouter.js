const express = require("express");
const router = express.Router();
const activityController = require("../Controllers/activityController");
const tokenAuth = require("../Middlewares/tokenAuth");
const tokenGet = require("../Middlewares/tokenGet");

router.post("/",tokenAuth,activityController.post_createActivity);
router.get("/",tokenAuth,activityController.get_activity);
router.get("/amount",tokenAuth,activityController.get_amountActivity);

module.exports = router;