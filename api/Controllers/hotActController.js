const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const Member = require("../../DB/models/memberModel");
const List = require("../../DB/models/listModel");
const Card = require("../../DB/models/cardModel");
const HotAct = require("../../DB/models/hotactModel");
const mongoose = require("mongoose");

//activityId, hotActName, info, dueDate
exports.post_createHotAct = (req, res, next) => {
  const activityId = req.body.activityId;
  const name = req.body.hotActName;
  const info = req.body.info;
  const dueDate = req.body.dueDate;

  const hotActId = mongoose.Types.ObjectId();

  const hotAct = HotAct({
    _id: hotActId,
    name: name,
    info: info,
    dueDate: dueDate,
    activityId: activityId,
    createrId: req.accountData.acID,
  });

  Activity.findOneAndUpdate(
    { _id: activityId },
    { $push: { hotAct: hotActId } },
    { new: true }
  )
    .then((result) => {
      hotAct
        .save()
        .then((hotActResult) => {
          return res.status(201).json({
            status: "Success",
            hotAct: hotActResult,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(400).json({
            status: "Error",
            code: "AT0062",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0061",
      });
    });
};
