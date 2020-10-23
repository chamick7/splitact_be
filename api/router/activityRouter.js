const express = require("express");
const router = express.Router();
const activityController = require("../Controllers/activityController");
const tokenAuth = require("../Middlewares/tokenAuth");

router.post("/",tokenAuth,activityController.post_createActivity);
router.get("/",tokenAuth,activityController.get_activity);


module.exports = router;