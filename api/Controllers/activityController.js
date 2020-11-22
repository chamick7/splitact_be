const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const Member = require("../../DB/models/memberModel");
const List = require("../../DB/models/listModel");
const Card = require("../../DB/models/cardModel");
const HotAct = require("../../DB/models/hotactModel");
const mongoose = require("mongoose");
const { update } = require("immutability-helper");
const { populate } = require("../../DB/models/accountModel");

const deleteActivity = async (activityId) => {
  await List.find({ activityId: activityId })
    .then((result) => {
      result.map((list) => {
        Card.deleteMany({ listId: list._id })
          .then((cardResult) => {
            List.deleteOne({ _id: list._id })
              .then((listResult) => {
                status = true;
              })
              .catch((err) => {
                status = false;
              });
          })
          .catch((err) => {
            status = false;
          });
      });
    })
    .catch((err) => {
      status = false;
    });
};

//atName,atCreaterID,member
exports.post_createActivity = (req, res, next) => {
  const crActivityId = mongoose.Types.ObjectId();

  const standardList = [
    {
      _id: mongoose.Types.ObjectId(),
      listName: "What to do?",
      createrId: req.accountData.acID,
      activityId: crActivityId,
      type: "standard",
    },
    {
      _id: mongoose.Types.ObjectId(),
      listName: "Doing.",
      createrId: req.accountData.acID,
      activityId: crActivityId,
      type: "standard",
    },
    {
      _id: mongoose.Types.ObjectId(),
      listName: "Done.",
      createrId: req.accountData.acID,
      activityId: crActivityId,
      type: "standard",
    },
  ];

  List.insertMany(standardList)
    .then((result) => {
      const activity = Activity({
        _id: crActivityId,
        atName: req.body.atName.trim(),
        atCreaterID: req.accountData.acID,
        color: req.body.color,
        list: result.map((list) => list._id),
        dueDate: req.body.dueDate || null,
      });

      activity
        .save()
        .then((result) => {
          try {
            let members = req.body.members.map((member) => ({
              _id: mongoose.Types.ObjectId(),
              acId: member.acID,
              atId: result._id,
            }));

            Member.insertMany(members)
              .then(() =>
                res.status(201).json({
                  status: "Success",
                  atID: result._id,
                })
              )
              .catch((err) => {
                console.log(err);
                return res.status(500).json({
                  status: "Error",
                  code: "AT0002",
                });
              });
          } catch (error) {
            return res.status(400).json({
              status: "Error",
              code: "AT0002",
            });
          }
        })
        .catch((err) => {
          return res.status(400).json({
            status: "Error",
            code: "AT0001",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0003",
      });
    });
};

//activityId, atName, color, dueDate
exports.post_editActivity = (req, res, next) => {
  const activityId = req.body.activityId;
  const atName = req.body.atName;
  const color = req.body.color;
  const dueDate = req.body.dueDate;

  Activity.findOneAndUpdate(
    { _id: activityId },
    {
      atName: atName,
      color: color,
      dueDate: dueDate,
    },
    { new: true }
  )
    .then((result) => {
      return res.status(200).json({
        status: "Success",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "",
      });
    });
};

//activityId, newMembers //fix after img
exports.post_addMember = (req, res, next) => {
  const activityId = req.body.activityId;
  const members = req.body.newMembers;

  const memberList = members.map((member) => ({
    _id: mongoose.Types.ObjectId(),
    acId: member.acID,
    atId: activityId,
  }));

  Member.insertMany(memberList)
    .then(async (result) => {
      const memberList = result.map((member) => ({
        acId: member.acId,
      }));
      const populateMember = await Account.populate(memberList, {
        path: "acId",
        select: "_id username",
      });

      return res.status(200).json({
        status: "Success",
        members: populateMember,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        status: "Error",
        code: "AT0014",
      });
    });
};

exports.get_activity = (req, res, next) => {
  console.log(req.query.activity);
  Member.findOne({
    $and: [{ acId: req.accountData.acID }, { atId: req.query.activity }],
  })
    .populate({
      path: "atId",
      populate: {
        path: "list",
        populate: {
          path: "cards",
          populate: {
            path: "workerId",
            select: "-password -__v -reg_date",
          },
        },
      },
    })
    .populate({
      path: "atId",
      populate: {
        path: "hotAct",
        select: "-__v",
      },
    })
    .select("-_id -__v -crDate")
    .then((dataRes) => {
      Member.find({ atId: req.query.activity })
        .populate({
          path: "acId",
          select: "-password -__v -reg_date ",
        })
        .select("-_id -__v -atId")
        .then((result) => {
          const members = result.map((member) => ({
            username: member.acId.username,
            id: member.acId._id,
            img: member.acId.img,
          }));

          const sortHotAct = dataRes.atId.hotAct.sort(
            (a, b) => a.dueDate - b.dueDate
          );

          return res.status(200).json({
            status: "Success",
            activity: dataRes.atId,
            members: members,
            hotAct: sortHotAct,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json({
            status: "Error",
            code: "AT0012",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).status({
        status: "Error",
        code: "AT0001",
      });
    });
};

exports.get_amountActivity = (req, res, next) => {
  Member.find({ acId: req.accountData.acID })
    .select("-_id")
    .populate("atId")
    .then((doc) => {
      return res.status(200).json({
        status: "Success",
        activities: doc,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: "Error",
        code: "AT0021",
      });
    });
};

//activityId
exports.post_leaveActivity = async (req, res, next) => {
  const acId = req.accountData.acID;
  const activityId = req.body.activityId;

  Member.findOneAndDelete({ $and: [{ acId: acId }, { atId: activityId }] })
    .then((result) => {
      console.log(result);
      Member.find({ atId: activityId })
        .then(async (result) => {
          if (result.length == 0) {
            deleteActivity(activityId);

            HotAct.deleteMany({ activityId: activityId })
              .then(() => {
                Activity.deleteOne({ _id: activityId })
                  .then((result) => {
                    return res.status(200).json({
                      status: "Success",
                    });
                  })
                  .catch((err) => {
                    return res.status(400).json({
                      status: "Error",
                      code: "AT0006",
                    });
                  });
              })
              .catch((err) => {
                return res.status(400).json({
                  status: "Error",
                  code: "AT0006",
                });
              });
          }
        })
        .catch((err) => {
          return res.status(200).json({
            status: "Error",
            code: "AT0005",
          });
        });
    })
    .catch((err) => {
      return res.status(200).json({
        status: "Error",
        code: "AT0005",
      });
    });
};
