const Account = require("../../DB/models/accountModel");
const Activity = require("../../DB/models/activityModel");
const Member = require("../../DB/models/memberModel");
const List = require("../../DB/models/listModel");
const Card = require("../../DB/models/cardModel");
const mongoose = require("mongoose");
const { update } = require("immutability-helper");

//card_name, card_description, dueDate, workerId, listId, color
exports.post_createCard = (req, res, next) => {
  console.log(req.body);
  const cardSave = Card({
    _id: mongoose.Types.ObjectId(),
    cardName: req.body.card_name.trim(),
    cardDescription: req.body.card_description.trim(),
    color: req.body.color,
    listId: req.body.listId,
    atId: req.body.activityId,
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
        card: resCard,
      });
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
  const card = req.body.card;

  List.update({ _id: oldListId }, { cards: oldCards })
    .then((result) => {
      List.update({ _id: newListId }, { cards: newCards })
        .then((result) => {
          Card.update({ _id: card._id }, { listId: newListId })
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
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0042",
      });
    });
};

exports.get_cardCalendar = (req, res, next) => {
  Card.find({ workerId: req.accountData.acID })
    .then((result) => {
      return res.status(200).json({
        status: "Success",
        cards: result,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "",
      });
    });
};

//cardId
exports.delete_card = (req, res, next) => {
  const cardId = req.body.cardId;

  Card.findOneAndDelete({ _id: cardId })
    .then((result) => {
      List.findOneAndUpdate(
        { _id: result.listId },
        { $pull: { cards: { cardId } } },
        { safe: true }
      )
        .then((listResult) => {
          return res.status(200).json({
            status: "Success",
            cardId: result._id,
            listId: result.listId,
          });
        })
        .catch((err) => {
          return res.status(400).json({
            status: "Error",
            code: "AT0044",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        status: "Error",
        code: "AT0044",
      });
    });
};
