const ActivityMember = require("../../DB/models/activityMemberModel");
const Activity = require("../../DB/models/activityModel");
const mongoose = require("mongoose");

const verifyMember = (acID, atID) => {
  ActivityMember.find({ acID: acID, atID: atID })
    .exec()
    .then((doc) => {
      if (doc.length >= 1) {
        return true;
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
};

//atName,atCreaterID,member
exports.post_createActivity = (req, res, next) => {
  const activity = Activity({
    _id: mongoose.Types.ObjectId(),
    atName: req.body.atName.trim(),
    atCreaterID: req.accountData.acID,
  });

  activity
    .save()
    .then((result) => {
      let allMember = [];

      req.body.members.map((member) => {

        allMember.push({
          atID: result._id,
          acID: member,
        });
      });

      ActivityMember.insertMany(allMember)
        .then(() => {
          return res.status(201).json({
            status: "Success",
          });
        })
        .catch((err) => {

          return res.status(500).json({
            status: "Error",
            code: "AT0002",
          });
        });
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
                  member: activityMember
              })
          })
          .catch((err) => {
            return res.status(404).json({
              status: "Error",
              code: "AT0012"
            })
          });
      })
      .catch((err) => {

        return res.status(404).json({
          status: "Error",
          code: "AT0013"
        })
      });
  } else {
    return res.status(401).json({
      status: "Error",
      code: "AT0011",
    });
  }
};
