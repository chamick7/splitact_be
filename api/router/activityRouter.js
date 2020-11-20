const express = require("express");
const router = express.Router();
const activityController = require("../Controllers/activityController");
const tokenAuth = require("../Middlewares/tokenAuth");
const tokenGet = require("../Middlewares/tokenGet");

router.post("/",tokenAuth,activityController.post_createActivity);
router.get("/",tokenAuth,activityController.get_activity);
router.get("/amount",tokenAuth,activityController.get_amountActivity);

router.post("/card",tokenAuth,activityController.post_createCard);
router.post("/editcard",tokenAuth, activityController.post_editCard);
router.post("/movecard",tokenAuth,activityController.post_moveCard);
router.post("/changelistcard", tokenAuth, activityController.post_changeListCard);


// router.post("/")
router.post("/editlist",tokenAuth,activityController.post_editList);

module.exports = router;