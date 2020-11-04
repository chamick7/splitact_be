const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const mongoose = require("mongoose");

const verifyMember = (acID, atID) => {
  // ActivityMember.find({ acID: acID, atID: atID })
  //   .exec()
  //   .then((doc) => {
  //     if (doc.length >= 1) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   })
  //   .catch((err) => {
  //     return false;
  //   });

  return true;
};

//atName,atCreaterID,member
exports.post_createActivity = (req, res, next) => {
  const activity = Activity({
    _id: mongoose.Types.ObjectId(),
    atName: req.body.atName.trim(),
    atCreaterID: req.accountData.acID,
    color: req.body.color,
    dueDate: req.body.dueDate,
  });

  activity
    .save()
    .then((result) => {
      try {
        req.body.members.map((member) => {
          console.log(member);
          Account.updateOne(
            { _id: member.acID },
            { $push: { activities: { atID: result._id } } }
          )
            .then(() => {
              return res.status(201).json({
                status: "Success",
                atID: result._id,
              });
            })
            .catch((err) => {});
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
};

exports.get_activity = (req, res, next) => {
  // console.log(req.query.activity);

  Account.findOne({ _id: req.accountData.acID })
    .select("activities -_id")
    .populate("activities.atID")
    .then((dataRes) => {
      const result = dataRes.activities.some(element => element.atID._id == req.query.activity);
      console.log(result);

      // if(result){

      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).status({
        status: "Error",
      });
    });

  res.status(200).json({
    status: "Success",
  });
};

exports.get_amountActivity = (req, res, next) => {
  Account.findOne({ _id: req.accountData.acID })
    .select("-activities.joinDate -activities._id")
    .populate("activities.atID -__v")
    .then((doc) => {
      req.session.activities = doc.activities;
      return res.status(200).json({
        status: "Success",
        activities: doc.activities,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        status: "Error",
        code: "AT0021",
      });
    });
};
