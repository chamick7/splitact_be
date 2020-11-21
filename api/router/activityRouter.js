const express = require("express");
const router = express.Router();
const activityController = require("../Controllers/activityController");
const cardRouter = require("./cardRouter");
const listRouter = require("./listRouter");
const hotActRouter = require("./hotActRouter");
const tokenAuth = require("../Middlewares/tokenAuth");
const tokenGet = require("../Middlewares/tokenGet");

router.post("/", tokenAuth, activityController.post_createActivity);
router.get("/", tokenAuth, activityController.get_activity);
router.post("/leave",tokenAuth, activityController.post_leaveActivity);
router.get("/amount", tokenAuth, activityController.get_amountActivity);
router.post("/member", tokenAuth, activityController.post_addMember);
router.post("/edit", tokenAuth, activityController.post_editActivity);

router.use("/card", cardRouter);

// router.post("/")
router.use("/list", listRouter);

router.use("/hotact", hotActRouter);

module.exports = router;
