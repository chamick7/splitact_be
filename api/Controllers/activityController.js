const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const Member = require("../../DB/models/memberModel");
const List = require("../../DB/models/listModel");
const Card = require("../../DB/models/cardModel");
const mongoose = require("mongoose");
const { update } = require("immutability-helper");

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
          }));

          return res.status(200).json({
            status: "Success",
            activity: dataRes.atId,
            members: members,
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

//card_name, card_description, dueDate, workerId, listId, color
exports.post_createCard = (req, res, next) => {
  const cardSave = Card({
    _id: mongoose.Types.ObjectId(),
    cardName: req.body.card_name.trim(),
    cardDescription: req.body.card_description.trim(),
    color: req.body.color,
    listId: req.body.listId,
    workerId: req.body.workerId || null,
    createrId: req.accountData.acID,
    dueDate: req.body.dueDate || null,
  });

  cardSave
    .save()
    .then((result) => {
      const card = result;

      List.findOneAndUpdate(
        { _id: result.listId },
        { $push: { cards: result._id } },
        { new: true }
      )
        .then(async (result) => {
          const cardReturn = await Account.populate(card, {
            path: "workerId",
            select: "-password -__v -reg_date",
          });

          console.log(cardReturn);

          return await res.status(201).json({
            status: "Success",
            card: cardReturn,
          });
        })
        .catch((err) => {
          return res.status(500).json({
            status: "Error",
            code: "AT0032",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        status: "Error",
        code: "AT0031",
      });
    });
};

//listId, cards
exports.post_moveCard = (req, res, next) => {
  const listId = req.body.listId;
  const cards = req.body.cards;

  List.updateOne({ _id: listId }, { cards: cards })
    .then((result) => {
      return res.status(200).json({
        status: "Success",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0041",
      });
    });
};

//cardId, card_name, card_description, color, dueDate, workerId
exports.post_editCard = (req, res, next) => {
  const cardId = req.body.cardId;
  const cardName = req.body.card_name;
  const cardDescription = req.body.card_description;
  const color = req.body.color;
  const dueDate = req.body.dueDate || null;
  const workerId = req.body.workerId || null;

  Card.findOneAndUpdate(
    { _id: cardId },
    {
      cardName: cardName,
      cardDescription: cardDescription,
      color: color,
      workerId: workerId,
      dueDate: dueDate,
    },
    { new: true }
  )
    .then(async (result) => {
      const resCard = await Card.populate(result, {
        path: "workerId",
        select: "-password -__v -reg_date",
      });

      return res.status(200).json({
        status: "Success",
        card: resCard
      })
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        status: "Error",
        code: "AT0033",
      });
    });
};

//oldlistId, oldCards, newListId, newCards
exports.post_changeListCard = (req, res, next) => {
  const oldListId = req.body.oldListId;
  const oldCards = req.body.oldCards;
  const newListId = req.body.newListId;
  const newCards = req.body.newCards;

  List.update({ _id: oldListId }, { cards: oldCards })
    .then((result) => {
      List.update({ _id: newListId }, { cards: newCards })
        .then((result) => {
          return res.status(200).json({
            status: "Success",
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: "Error",
            code: "AT0042",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0042",
      });
    });
};

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
