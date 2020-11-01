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
  if (verifyMember(req.accountData.acID, req.query.activity)) {
    Activity.find({ _id: req.query.activity })
      .exec()
      .then((activity) => {
        const resActivity = {
          atID: activity[0]._id,
          atName: activity[0].acName,
        };

        ActivityMember.find({ atID: activity[0]._id })
          .exec()
          .then((activityMember) => {
            return res.status(200).json({
              status: "Success",
              activity: resActivity,
              member: activityMember,
            });
          })
          .catch((err) => {
            return res.status(404).json({
              status: "Error",
              code: "AT0012",
            });
          });
      })
      .catch((err) => {
        return res.status(404).json({
          status: "Error",
          code: "AT0013",
        });
      });
  } else {
    return res.status(401).json({
      status: "Error",
      code: "AT0011",
    });
  }
};

exports.get_amountActivity = (req, res, next) => {
  Account.findOne({ _id: req.accountData.acID })
  .select("-activities.joinDate -activities._id")
    .populate("activities.atID -__v")
    .then((doc) => {
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
