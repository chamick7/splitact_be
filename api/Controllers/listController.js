const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const Member = require("../../DB/models/memberModel");
const List = require("../../DB/models/listModel");
const Card = require("../../DB/models/cardModel");
const mongoose = require("mongoose");
const { update } = require("immutability-helper");


//listId, newName
exports.post_editList = (req, res, next) => {
    const listId = req.body.listId;
    const newName = req.body.newName;
  
    List.findOneAndUpdate({ _id: listId }, { listName: newName }, { new: true })
      .then(async (result) => {
        const resList = await List.populate(result, {
          path: "cards",
          select: "-__v",
          populate: {
            path: "workerId",
            select: "-password -__v -reg_date",
          },
        });
        return res.status(200).json({
          status: "Success",
          list: resList,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          status: "Error",
          code: "AT0055",
        });
      });
  };