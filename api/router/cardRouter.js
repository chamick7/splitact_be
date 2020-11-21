const express = require("express");
const router = express.Router();
const cardController = require("../Controllers/cardController");
const tokenAuth = require("../Middlewares/tokenAuth");
const tokenGet = require("../Middlewares/tokenGet");

router.post("/",tokenAuth,cardController.post_createCard);
router.post("/edit",tokenAuth, cardController.post_editCard);
router.post("/move",tokenAuth,cardController.post_moveCard);
router.post("/changelist", tokenAuth, cardController.post_changeListCard);
router.get("/calendar",tokenAuth,cardController.get_cardCalendar);


module.exports = router;
